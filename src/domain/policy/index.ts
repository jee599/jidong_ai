import adjustmentZonesJson from "@/src/policies/adjustment-zones.json";
import dsrRulesJson from "@/src/policies/dsr_rules.json";
import taxRulesJson from "@/src/policies/tax_rules.json";
import type { AdjustmentZoneRules, DsrRules, PolicyMeta, TaxRules } from "./types";

export const taxRules: TaxRules = taxRulesJson;
export const dsrRules: DsrRules = dsrRulesJson;
export const adjustmentZones: AdjustmentZoneRules = adjustmentZonesJson;

export function mergePolicyMeta(...metas: PolicyMeta[]): PolicyMeta {
  return {
    basisDate: metas.map((item) => item.basisDate).sort().join(","),
    policyVersion: metas.map((item) => item.policyVersion).join("+")
  };
}
