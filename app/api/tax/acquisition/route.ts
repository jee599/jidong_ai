import { NextResponse } from "next/server";
import { taxRules } from "@/src/domain/policy";
import { computeAcquisitionTax, type AcquisitionTaxInput } from "@/src/domain/tax/acquisition";
import { envelope } from "@/src/lib/api-envelope";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AcquisitionTaxInput;
    const result = computeAcquisitionTax(body);

    return NextResponse.json(
      envelope(
        {
          acquisitionTaxKrw: result.acquisitionTaxKrw.toString(),
          localEducationTaxKrw: result.localEducationTaxKrw.toString(),
          ruralSpecialTaxKrw: result.ruralSpecialTaxKrw.toString(),
          totalTaxKrw: result.totalTaxKrw.toString(),
          acquisitionTaxRatePpm: result.acquisitionTaxRatePpm.toString(),
          isHeavyTaxRate: result.isHeavyTaxRate
        },
        { basisDate: taxRules.basisDate, policyVersion: taxRules.policyVersion }
      )
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
        meta: {
          basisDate: taxRules.basisDate,
          policyVersion: taxRules.policyVersion,
          generatedAt: new Date().toISOString()
        }
      },
      { status: 400 }
    );
  }
}
