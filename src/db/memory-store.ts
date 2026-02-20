import type { EntityRow, PaymentRow, PolicyVersionRow, ReportRow } from "@/src/db/types";

interface MemoryStoreState {
  entities: Map<string, EntityRow>;
  reports: Map<string, ReportRow>;
  payments: Map<string, PaymentRow>;
  policyVersions: Map<string, PolicyVersionRow>;
}

const memoryStore: MemoryStoreState = {
  entities: new Map(),
  reports: new Map(),
  payments: new Map(),
  policyVersions: new Map()
};

function nowIso() {
  return new Date().toISOString();
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const entityRepo = {
  upsert(input: Omit<EntityRow, "createdAt" | "updatedAt">): EntityRow {
    const existing = memoryStore.entities.get(input.id);
    const timestamp = nowIso();
    const row: EntityRow = {
      ...input,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp
    };
    memoryStore.entities.set(row.id, row);
    return row;
  },
  getById(id: string): EntityRow | null {
    return memoryStore.entities.get(id) ?? null;
  }
};

export const reportRepo = {
  create(
    input: Omit<ReportRow, "id" | "createdAt" | "updatedAt" | "status" | "summaryJson"> & {
      status?: ReportRow["status"];
      summaryJson?: string | null;
    }
  ): ReportRow {
    const timestamp = nowIso();
    const row: ReportRow = {
      id: randomId("rpt"),
      status: input.status ?? "pending",
      summaryJson: input.summaryJson ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...input
    };
    memoryStore.reports.set(row.id, row);
    return row;
  },
  updateStatus(id: string, status: ReportRow["status"], summaryJson?: string): ReportRow | null {
    const found = memoryStore.reports.get(id);
    if (!found) return null;
    const row: ReportRow = { ...found, status, summaryJson: summaryJson ?? found.summaryJson, updatedAt: nowIso() };
    memoryStore.reports.set(id, row);
    return row;
  },
  getById(id: string): ReportRow | null {
    return memoryStore.reports.get(id) ?? null;
  }
};

export const paymentRepo = {
  create(input: Omit<PaymentRow, "id" | "createdAt" | "updatedAt">): PaymentRow {
    const timestamp = nowIso();
    const row: PaymentRow = {
      ...input,
      id: randomId("pay"),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    memoryStore.payments.set(row.id, row);
    return row;
  },
  updateStatus(id: string, status: PaymentRow["status"], providerRef?: string): PaymentRow | null {
    const found = memoryStore.payments.get(id);
    if (!found) return null;
    const row: PaymentRow = {
      ...found,
      status,
      providerRef: providerRef ?? found.providerRef,
      updatedAt: nowIso()
    };
    memoryStore.payments.set(row.id, row);
    return row;
  },
  getById(id: string): PaymentRow | null {
    return memoryStore.payments.get(id) ?? null;
  },
  listByReportAndUser(reportId: string, userId: string): PaymentRow[] {
    return Array.from(memoryStore.payments.values()).filter((row) => row.reportId === reportId && row.userId === userId);
  }
};

export const policyVersionRepo = {
  upsert(input: Omit<PolicyVersionRow, "id" | "createdAt">): PolicyVersionRow {
    const existing = Array.from(memoryStore.policyVersions.values()).find(
      (row) => row.policyKey === input.policyKey && row.basisDate === input.basisDate
    );
    const row: PolicyVersionRow = existing
      ? { ...existing, ...input }
      : {
          id: randomId("plc"),
          createdAt: nowIso(),
          ...input
        };
    memoryStore.policyVersions.set(row.id, row);
    return row;
  },
  list(policyKey: string): PolicyVersionRow[] {
    return Array.from(memoryStore.policyVersions.values()).filter((row) => row.policyKey === policyKey);
  }
};

export function resetMemoryStore() {
  memoryStore.entities.clear();
  memoryStore.reports.clear();
  memoryStore.payments.clear();
  memoryStore.policyVersions.clear();
}
