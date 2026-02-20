import { NextResponse } from "next/server";
import { getFreeDashboardById, marketDataPolicyMeta } from "@/src/features/dashboard/mock-repository";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";
import { withCache } from "@/src/lib/cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = (searchParams.get("propertyId") ?? "").trim();
    if (!propertyId) {
      return NextResponse.json(errorEnvelope("propertyId가 필요합니다.", marketDataPolicyMeta), { status: 400 });
    }
    const found = withCache(`free-dashboard:${propertyId}`, 60_000, () => getFreeDashboardById(propertyId));
    if (!found) {
      return NextResponse.json(errorEnvelope("해당 매물을 찾을 수 없습니다.", marketDataPolicyMeta), { status: 404 });
    }
    return NextResponse.json(
      envelope(
        {
          propertyId: found.id,
          apartmentName: found.apartmentName,
          district: found.district,
          exclusiveAreaM2: found.exclusiveAreaM2,
          latestTradePriceKrw: found.latestTradePriceKrw.toString(),
          latestTradeDate: found.latestTradeDate,
          estimatedJeonseKrw: found.estimatedJeonseKrw.toString(),
          rentYieldPpm: found.rentYieldPpm.toString(),
          riskBand: found.riskBand,
          sourceLabel: found.sourceLabel,
          sourceUrl: found.sourceUrl
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
