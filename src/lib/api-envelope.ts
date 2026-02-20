import type { PolicyMeta } from "@/src/domain/policy/types";

export interface ApiMeta extends PolicyMeta {
  generatedAt: string;
}

export function envelope<T>(data: T, policyMeta: PolicyMeta) {
  return {
    ok: true as const,
    data,
    meta: {
      ...policyMeta,
      generatedAt: new Date().toISOString()
    } satisfies ApiMeta
  };
}
