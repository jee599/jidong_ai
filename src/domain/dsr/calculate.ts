import { dsrRules } from "@/src/domain/policy";
import { divRound } from "@/src/domain/tax/math";

export interface DsrInput {
  annualIncomeKrw: number;
  annualDebtServiceKrw: number;
}

export interface DsrResult {
  dsrPpm: bigint;
  isWithinLimit: boolean;
  maxDsrPpm: number;
}

export function calculateDsr(input: DsrInput): DsrResult {
  if (!Number.isInteger(input.annualIncomeKrw) || input.annualIncomeKrw < dsrRules.dsr.minimumAnnualIncomeKrw) {
    throw new Error("annualIncomeKrw must be a positive integer");
  }
  if (!Number.isInteger(input.annualDebtServiceKrw) || input.annualDebtServiceKrw < 0) {
    throw new Error("annualDebtServiceKrw must be a non-negative integer");
  }

  const dsrPpm = divRound(BigInt(input.annualDebtServiceKrw) * 1_000_000n, BigInt(input.annualIncomeKrw));
  return {
    dsrPpm,
    isWithinLimit: dsrPpm <= BigInt(dsrRules.dsr.maxDsrPpm),
    maxDsrPpm: dsrRules.dsr.maxDsrPpm
  };
}
