"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  formatKrw,
  formatRatePercent,
  INITIAL_ACQUISITION_TAX_FORM,
  type FormErrors,
  validateAcquisitionTaxForm
} from "@/src/features/acquisition-tax/form";
import taxRulesJson from "@/src/policies/tax_rules.json";

interface CalculationData {
  acquisitionTaxKrw: string;
  localEducationTaxKrw: string;
  ruralSpecialTaxKrw: string;
  totalTaxKrw: string;
  acquisitionTaxRatePpm: string;
  isHeavyTaxRate: boolean;
}

interface ApiMeta {
  basisDate: string;
  policyVersion: string;
  generatedAt: string;
}

interface SuccessResponse {
  ok: true;
  data: CalculationData;
  meta: ApiMeta;
}

interface ErrorResponse {
  ok: false;
  error: string;
  meta: ApiMeta;
}

function parseKrwString(value: string): string {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return "-";
  }
  return `${formatKrw(parsed)}원`;
}

export default function AcquisitionTaxCalculatorPage() {
  const [form, setForm] = useState(INITIAL_ACQUISITION_TAX_FORM);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SuccessResponse | null>(null);
  const [showProcess, setShowProcess] = useState(false);

  const basisDateLabel = useMemo(() => result?.meta.basisDate ?? taxRulesJson.basisDate, [result]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    const validated = validateAcquisitionTaxForm(form);
    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setResult(null);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tax/acquisition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.apiInput)
      });
      const payload = (await response.json()) as SuccessResponse | ErrorResponse;
      if (!response.ok || !payload.ok) {
        setResult(null);
        setRequestError(payload.ok ? "계산 중 오류가 발생했습니다." : payload.error);
        return;
      }
      setResult(payload);
    } catch {
      setResult(null);
      setRequestError("네트워크 오류로 계산에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>취득세 계산기</h1>
      <p className="muted">기준일: {basisDateLabel}</p>
      <section className="card">
        <form className="form-grid" onSubmit={onSubmit} noValidate>
          <label htmlFor="purchasePriceKrw">매수 가격 (원)</label>
          <input
            id="purchasePriceKrw"
            inputMode="numeric"
            value={form.purchasePriceKrw}
            onChange={(event) => setForm((prev) => ({ ...prev, purchasePriceKrw: event.target.value }))}
            placeholder="예: 850000000"
            aria-invalid={Boolean(fieldErrors.purchasePriceKrw)}
          />
          {fieldErrors.purchasePriceKrw && <p className="error-text">{fieldErrors.purchasePriceKrw}</p>}

          <label htmlFor="ownedHouseCount">현재 주택 보유 수</label>
          <select
            id="ownedHouseCount"
            value={form.ownedHouseCount}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, ownedHouseCount: event.target.value as "0" | "1" | "2" | "3" }))
            }
          >
            <option value="0">0채</option>
            <option value="1">1채</option>
            <option value="2">2채</option>
            <option value="3">3채 이상</option>
          </select>
          {fieldErrors.ownedHouseCount && <p className="error-text">{fieldErrors.ownedHouseCount}</p>}

          <label htmlFor="isAdjustmentTargetArea">조정대상지역 여부</label>
          <select
            id="isAdjustmentTargetArea"
            value={form.isAdjustmentTargetArea ? "yes" : "no"}
            onChange={(event) => setForm((prev) => ({ ...prev, isAdjustmentTargetArea: event.target.value === "yes" }))}
          >
            <option value="no">아니오</option>
            <option value="yes">예</option>
          </select>

          <label htmlFor="exclusiveAreaM2">전용면적 (m²)</label>
          <input
            id="exclusiveAreaM2"
            inputMode="decimal"
            value={form.exclusiveAreaM2}
            onChange={(event) => setForm((prev) => ({ ...prev, exclusiveAreaM2: event.target.value }))}
            placeholder="예: 84.99"
            aria-invalid={Boolean(fieldErrors.exclusiveAreaM2)}
          />
          {fieldErrors.exclusiveAreaM2 && <p className="error-text">{fieldErrors.exclusiveAreaM2}</p>}

          <label className="checkbox-label" htmlFor="agreedDisclaimer">
            <input
              id="agreedDisclaimer"
              type="checkbox"
              checked={form.agreedDisclaimer}
              onChange={(event) => setForm((prev) => ({ ...prev, agreedDisclaimer: event.target.checked }))}
            />
            <span>참고용 계산 결과이며 실제 신고 금액은 관할 기관 확인이 필요함을 이해했습니다.</span>
          </label>
          {fieldErrors.agreedDisclaimer && <p className="error-text">{fieldErrors.agreedDisclaimer}</p>}

          <div className="button-row">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "계산 중..." : "세금 계산"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setForm(INITIAL_ACQUISITION_TAX_FORM);
                setFieldErrors({});
                setRequestError(null);
                setResult(null);
              }}
              disabled={isSubmitting}
            >
              초기화
            </button>
          </div>
        </form>
        {requestError && <p className="error-box">{requestError}</p>}
      </section>

      {result && (
        <section className="card">
          <h2>계산 결과</h2>
          <dl className="result-grid">
            <dt>취득세</dt>
            <dd>{parseKrwString(result.data.acquisitionTaxKrw)}</dd>
            <dt>지방교육세</dt>
            <dd>{parseKrwString(result.data.localEducationTaxKrw)}</dd>
            <dt>농어촌특별세</dt>
            <dd>{parseKrwString(result.data.ruralSpecialTaxKrw)}</dd>
            <dt>합계</dt>
            <dd className="total">{parseKrwString(result.data.totalTaxKrw)}</dd>
            <dt>적용 취득세율</dt>
            <dd>{formatRatePercent(result.data.acquisitionTaxRatePpm)}</dd>
            <dt>중과 여부</dt>
            <dd>{result.data.isHeavyTaxRate ? "중과 적용" : "일반세율 적용"}</dd>
          </dl>
          <p className="muted">
            정책 버전: {result.meta.policyVersion} / 산출 시각: {new Date(result.meta.generatedAt).toLocaleString("ko-KR")}
          </p>
        </section>
      )}

      <section className="card">
        <button className="toggle-button" type="button" onClick={() => setShowProcess((prev) => !prev)}>
          {showProcess ? "계산 과정 숨기기" : "계산 과정 보기"}
        </button>
        {showProcess && (
          <ol className="process-list">
            <li>입력값(매수 가격/보유 수/조정대상지역/전용면적)을 API에 전달합니다.</li>
            <li>정책 JSON 기준으로 취득세율과 중과 여부를 판정합니다.</li>
            <li>취득세, 지방교육세, 농어촌특별세를 계산한 뒤 합계를 반환합니다.</li>
            <li>결과와 함께 기준일/정책버전/생성시각 메타를 표시합니다.</li>
          </ol>
        )}
      </section>

      <section className="card">
        <h2>신뢰 안내</h2>
        <ul className="process-list">
          <li>정책 기준일: {basisDateLabel}</li>
          <li>정책 버전: {result?.meta.policyVersion ?? taxRulesJson.policyVersion}</li>
          <li>모든 결과는 정책 JSON 기준 자동 계산이며 개별 사실관계 예외는 반영되지 않을 수 있습니다.</li>
          <li>
            정책 파일 확인: <a href="/policies">/policies</a>
          </li>
        </ul>
      </section>

      <section className="card">
        <p className="disclaimer">
          법적 고지: 본 서비스는 세무/법률 자문을 제공하지 않습니다. 실제 신고/납부 전에는 관할 기관 또는 전문가 확인이 필요합니다.
        </p>
      </section>
    </main>
  );
}
