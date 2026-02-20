export interface EntityRow {
  id: string;
  entityType: "property";
  displayName: string;
  regionCode: string;
  payloadJson: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRow {
  id: string;
  entityId: string;
  userId: string;
  reportType: "free-dashboard" | "paid-ai-summary";
  status: "pending" | "ready" | "failed";
  summaryJson: string | null;
  basisDate: string;
  policyVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRow {
  id: string;
  reportId: string;
  userId: string;
  amountKrw: number;
  currency: "KRW";
  status: "requires_auth" | "ready_to_pay" | "paid" | "failed";
  provider: "mock";
  providerRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyVersionRow {
  id: string;
  policyKey: string;
  basisDate: string;
  policyVersion: string;
  checksumSha256: string | null;
  publishedAt: string;
  createdAt: string;
}
