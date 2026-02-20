export interface BatchRunResult {
  jobName: string;
  status: "ok" | "partial";
  startedAt: string;
  finishedAt: string;
  notes: string[];
}

export async function runPolicyVersionSyncJob(): Promise<BatchRunResult> {
  const startedAt = new Date().toISOString();
  // TODO(day12): connect to real policy source API and persist delta to policy_versions table.
  const notes = ["mock sync complete", "real external adapter pending credentials"];
  return {
    jobName: "policy-version-sync",
    status: "partial",
    startedAt,
    finishedAt: new Date().toISOString(),
    notes
  };
}

export async function runReportWarmupJob(): Promise<BatchRunResult> {
  const startedAt = new Date().toISOString();
  // TODO(day12): warm cache for top search keywords and pending paid reports.
  return {
    jobName: "report-warmup",
    status: "partial",
    startedAt,
    finishedAt: new Date().toISOString(),
    notes: ["cache warmup scaffold only", "queue/worker adapter pending"]
  };
}
