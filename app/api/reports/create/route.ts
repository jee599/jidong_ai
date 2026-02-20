import { NextResponse } from "next/server";
import { entityRepo, reportRepo } from "@/src/db/memory-store";
import { getFreeDashboardById, marketDataPolicyMeta } from "@/src/features/dashboard/mock-repository";
import { getAuthUser } from "@/src/lib/auth";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";

interface CreateReportRequest {
  propertyId: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateReportRequest;
    const propertyId = body.propertyId?.trim();
    if (!propertyId) {
      return NextResponse.json(errorEnvelope("propertyId가 필요합니다.", marketDataPolicyMeta), { status: 400 });
    }

    const property = getFreeDashboardById(propertyId);
    if (!property) {
      return NextResponse.json(errorEnvelope("해당 매물을 찾을 수 없습니다.", marketDataPolicyMeta), { status: 404 });
    }

    entityRepo.upsert({
      id: property.id,
      entityType: "property",
      displayName: property.apartmentName,
      regionCode: property.district,
      payloadJson: JSON.stringify(property)
    });

    const user = getAuthUser(req);
    const report = reportRepo.create({
      entityId: property.id,
      userId: user?.userId ?? "guest",
      reportType: "free-dashboard",
      basisDate: marketDataPolicyMeta.basisDate,
      policyVersion: marketDataPolicyMeta.policyVersion
    });

    return NextResponse.json(
      envelope(
        {
          reportId: report.id,
          propertyId: property.id,
          requiresAuthForPayment: true
        },
        marketDataPolicyMeta
      )
    );
  } catch (error) {
    return NextResponse.json(
      errorEnvelope(error instanceof Error ? error.message : "Unexpected error", marketDataPolicyMeta),
      { status: 500 }
    );
  }
}
