import { NextResponse } from "next/server";
import { taxRules } from "@/src/domain/policy";
import { computeAcquisitionTax } from "@/src/domain/tax/acquisition";
import { parseAcquisitionTaxInput } from "@/src/domain/tax/acquisition-input";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = parseAcquisitionTaxInput(body);
    const result = computeAcquisitionTax(input);

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
      errorEnvelope(error instanceof Error ? error.message : "Unexpected error", {
        basisDate: taxRules.basisDate,
        policyVersion: taxRules.policyVersion
      }),
      { status: 400 }
    );
  }
}
