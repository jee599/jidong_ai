import { NextResponse } from "next/server";
import { dsrRules, taxRules } from "@/src/domain/policy";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: { status: "healthy" },
    meta: {
      basisDate: `${taxRules.basisDate},${dsrRules.basisDate}`,
      policyVersion: `${taxRules.policyVersion}+${dsrRules.policyVersion}`,
      generatedAt: new Date().toISOString()
    }
  });
}
