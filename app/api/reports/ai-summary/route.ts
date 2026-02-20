import { NextResponse } from "next/server";
import { reportRepo } from "@/src/db/memory-store";
import { getFreeDashboardById, marketDataPolicyMeta } from "@/src/features/dashboard/mock-repository";
import { assertDisclaimerAccepted, buildSafeSummaryPrompt, buildScaffoldedSummary } from "@/src/features/reports/ai-summary";
import { getPaidPaymentByReport } from "@/src/features/payments/service";
import { getAuthUser } from "@/src/lib/auth";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";

interface AiSummaryRequest {
  reportId: string;
  disclaimerAccepted: boolean;
}

export async function POST(req: Request) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(errorEnvelope("AI 요약은 로그인 후 이용할 수 있습니다.", marketDataPolicyMeta), { status: 401 });
    }
    const body = (await req.json()) as AiSummaryRequest;
    assertDisclaimerAccepted(Boolean(body.disclaimerAccepted));

    const reportId = body.reportId?.trim();
    if (!reportId) {
      return NextResponse.json(errorEnvelope("reportId가 필요합니다.", marketDataPolicyMeta), { status: 400 });
    }
    const report = reportRepo.getById(reportId);
    if (!report || report.userId !== user.userId) {
      return NextResponse.json(errorEnvelope("리포트 접근 권한이 없습니다.", marketDataPolicyMeta), { status: 403 });
    }
    const paidPayment = getPaidPaymentByReport(report.id, user.userId);
    if (!paidPayment) {
      return NextResponse.json(errorEnvelope("결제 완료 후 AI 요약을 요청할 수 있습니다.", marketDataPolicyMeta), { status: 402 });
    }

    const entity = getFreeDashboardById(report.entityId);
    if (!entity) {
      return NextResponse.json(errorEnvelope("리포트 기반 데이터가 존재하지 않습니다.", marketDataPolicyMeta), { status: 404 });
    }

    const prompt = buildSafeSummaryPrompt({
      apartmentName: entity.apartmentName,
      district: entity.district,
      latestTradePriceKrw: entity.latestTradePriceKrw.toString(),
      estimatedJeonseKrw: entity.estimatedJeonseKrw.toString(),
      riskBand: entity.riskBand
    });
    const summary = buildScaffoldedSummary({
      apartmentName: entity.apartmentName,
      district: entity.district,
      latestTradePriceKrw: entity.latestTradePriceKrw.toString(),
      estimatedJeonseKrw: entity.estimatedJeonseKrw.toString(),
      riskBand: entity.riskBand
    });
    reportRepo.updateStatus(report.id, "ready", JSON.stringify({ summary }));

    return NextResponse.json(
      envelope(
        {
          reportId: report.id,
          summary,
          safePromptPreview: prompt,
          disclaimer:
            "본 요약은 참고용 자동 생성 문서입니다. 투자/세무/법률 의사결정 전 반드시 최신 공공자료와 전문가 검토가 필요합니다."
        },
        {
          basisDate: report.basisDate,
          policyVersion: report.policyVersion
        }
      )
    );
  } catch (error) {
    return NextResponse.json(
      errorEnvelope(error instanceof Error ? error.message : "Unexpected error", marketDataPolicyMeta),
      { status: 400 }
    );
  }
}
