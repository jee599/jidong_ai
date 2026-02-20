interface BuildSafePromptInput {
  apartmentName: string;
  district: string;
  latestTradePriceKrw: string;
  estimatedJeonseKrw: string;
  riskBand: "low" | "medium" | "high";
}

export function buildSafeSummaryPrompt(input: BuildSafePromptInput): string {
  return [
    "역할: 한국 부동산 참고 리포트 초안 작성기",
    "제약: 투자 권유/세무 자문/확정 표현 금지. 불확실성 명시.",
    "형식: 1) 요약 2) 관찰 포인트 3) 리스크 경고 4) 확인 필요 항목",
    "문구 규칙: '가능성', '참고', '확인 필요' 표현 사용",
    `대상: ${input.apartmentName} (${input.district})`,
    `최근 실거래가: ${input.latestTradePriceKrw}원`,
    `추정 전세가: ${input.estimatedJeonseKrw}원`,
    `리스크 밴드: ${input.riskBand}`
  ].join("\n");
}

export function buildScaffoldedSummary(input: BuildSafePromptInput): string {
  const risk = input.riskBand === "high" ? "가격 변동성 점검 우선" : input.riskBand === "medium" ? "수요/공급 균형 점검 필요" : "기초 지표는 안정적";
  return [
    `요약: ${input.apartmentName}은(는) ${input.district} 권역의 참고 분석 대상입니다.`,
    `관찰 포인트: 최근 실거래가 ${Number(input.latestTradePriceKrw).toLocaleString("ko-KR")}원, 추정 전세가 ${Number(input.estimatedJeonseKrw).toLocaleString("ko-KR")}원입니다.`,
    `리스크 경고: ${risk}.`,
    "확인 필요 항목: 실제 거래 가능 가격, 대출 조건, 세금 및 신고 요건은 최신 공공자료와 전문가 검토가 필요합니다."
  ].join("\n");
}

export function assertDisclaimerAccepted(disclaimerAccepted: boolean) {
  if (!disclaimerAccepted) {
    throw new Error("AI 요약 요청 전 법적 고지 확인이 필요합니다.");
  }
}
