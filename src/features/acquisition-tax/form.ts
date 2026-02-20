import type { AcquisitionTaxInput } from "@/src/domain/tax/acquisition";

export type OwnedHouseCountOption = "0" | "1" | "2" | "3";

export interface AcquisitionTaxFormState {
  purchasePriceKrw: string;
  ownedHouseCount: OwnedHouseCountOption;
  isAdjustmentTargetArea: boolean;
  exclusiveAreaM2: string;
  agreedDisclaimer: boolean;
}

export type FormErrors = Partial<Record<keyof AcquisitionTaxFormState, string>>;

export interface FormValidationSuccess {
  ok: true;
  apiInput: AcquisitionTaxInput;
}

export interface FormValidationFailure {
  ok: false;
  fieldErrors: FormErrors;
}

export type FormValidationResult = FormValidationSuccess | FormValidationFailure;

export const INITIAL_ACQUISITION_TAX_FORM: AcquisitionTaxFormState = {
  purchasePriceKrw: "",
  ownedHouseCount: "0",
  isAdjustmentTargetArea: false,
  exclusiveAreaM2: "",
  agreedDisclaimer: false
};

export function normalizeNumericInput(value: string): string {
  return value.replace(/,/g, "").trim();
}

function parsePositiveInteger(value: string): number | null {
  const normalized = normalizeNumericInput(value);
  if (!/^\d+$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parseNonNegativeNumber(value: string): number | null {
  const normalized = normalizeNumericInput(value);
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

export function validateAcquisitionTaxForm(state: AcquisitionTaxFormState): FormValidationResult {
  const fieldErrors: FormErrors = {};

  const purchasePriceKrw = parsePositiveInteger(state.purchasePriceKrw);
  if (purchasePriceKrw === null) {
    fieldErrors.purchasePriceKrw = "매수 가격은 1원 이상의 정수로 입력해 주세요.";
  }

  const exclusiveAreaM2 = parseNonNegativeNumber(state.exclusiveAreaM2);
  if (exclusiveAreaM2 === null) {
    fieldErrors.exclusiveAreaM2 = "전용면적은 0 이상의 숫자로 입력해 주세요.";
  }

  if (!["0", "1", "2", "3"].includes(state.ownedHouseCount)) {
    fieldErrors.ownedHouseCount = "주택 보유 수를 선택해 주세요.";
  }

  if (!state.agreedDisclaimer) {
    fieldErrors.agreedDisclaimer = "면책/정책 기준 안내를 확인해 주세요.";
  }

  if (Object.keys(fieldErrors).length > 0 || purchasePriceKrw === null || exclusiveAreaM2 === null) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    apiInput: {
      purchasePriceKrw,
      // UI is pre-acquisition house count(0/1/2/3+). API expects post-acquisition count(>=1).
      ownedHouseCount: Number(state.ownedHouseCount) + 1,
      isAdjustmentTargetArea: state.isAdjustmentTargetArea,
      exclusiveAreaM2
    }
  };
}

export function formatKrw(value: bigint | number): string {
  return new Intl.NumberFormat("ko-KR").format(typeof value === "number" ? value : Number(value));
}

export function formatRatePercent(ppmAsString: string): string {
  const ppm = Number(ppmAsString);
  if (!Number.isFinite(ppm)) {
    return "-";
  }
  return `${(ppm / 10_000).toFixed(4).replace(/\.?0+$/, "")}%`;
}
