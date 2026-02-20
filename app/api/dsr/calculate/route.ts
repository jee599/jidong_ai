import { NextResponse } from "next/server";
import { dsrRules } from "@/src/domain/policy";
import { calculateDsr, type DsrInput } from "@/src/domain/dsr/calculate";
import { envelope } from "@/src/lib/api-envelope";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DsrInput;
    const result = calculateDsr(body);

    return NextResponse.json(
      envelope(
        {
          dsrPpm: result.dsrPpm.toString(),
          maxDsrPpm: result.maxDsrPpm,
          isWithinLimit: result.isWithinLimit
        },
        { basisDate: dsrRules.basisDate, policyVersion: dsrRules.policyVersion }
      )
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
        meta: {
          basisDate: dsrRules.basisDate,
          policyVersion: dsrRules.policyVersion,
          generatedAt: new Date().toISOString()
        }
      },
      { status: 400 }
    );
  }
}
