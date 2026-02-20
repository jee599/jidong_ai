import { NextResponse } from "next/server";
import { dsrRules, mergePolicyMeta, taxRules } from "@/src/domain/policy";
import { envelope } from "@/src/lib/api-envelope";

export async function GET() {
  return NextResponse.json(
    envelope(
      { status: "healthy" },
      mergePolicyMeta(
        { basisDate: taxRules.basisDate, policyVersion: taxRules.policyVersion },
        { basisDate: dsrRules.basisDate, policyVersion: dsrRules.policyVersion }
      )
    )
  );
}
