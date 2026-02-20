import { NextResponse } from "next/server";
import { marketDataPolicyMeta, searchProperties } from "@/src/features/dashboard/mock-repository";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";
import { withCache } from "@/src/lib/cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";
    if (query.trim().length < 2) {
      return NextResponse.json(errorEnvelope("검색어는 2자 이상 입력해 주세요.", marketDataPolicyMeta), { status: 400 });
    }
    const results = withCache(`search:${query}`, 45_000, () =>
      searchProperties(query).map((item) => ({
        propertyId: item.id,
        apartmentName: item.apartmentName,
        district: item.district,
        addressRoad: item.addressRoad,
        exclusiveAreaM2: item.exclusiveAreaM2,
        latestTradePriceKrw: item.latestTradePriceKrw.toString(),
        latestTradeDate: item.latestTradeDate
      }))
    );
    return NextResponse.json(envelope({ count: results.length, results }, marketDataPolicyMeta));
  } catch (error) {
    return NextResponse.json(
      errorEnvelope(error instanceof Error ? error.message : "Unexpected error", marketDataPolicyMeta),
      { status: 500 }
    );
  }
}
