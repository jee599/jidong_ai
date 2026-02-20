export interface PolicyMeta {
  basisDate: string;
  policyVersion: string;
}

export interface TaxRules extends PolicyMeta {
  acquisitionTax: {
    oneHome: {
      standardRateBelow6EokPpm: number;
      formulaRange: {
        minEokInclusive: number;
        maxEokExclusive: number;
        formula: string;
      };
      standardRateFrom9EokPpm: number;
    };
    multiHome: {
      generalRatePpm: number;
      adjustmentTargetAreaHeavyRatePpm: number;
    };
    localEducationTax: {
      nonHeavyMultiplierPpm: number;
      heavyRatePpm: number;
    };
    ruralSpecialTax: {
      areaTaxFreeMaxM2: number;
      ratePpm: number;
    };
  };
}

export interface DsrRules extends PolicyMeta {
  dsr: {
    maxDsrPpm: number;
    minimumAnnualIncomeKrw: number;
    notes: string;
  };
}

export interface AdjustmentZoneRules extends PolicyMeta {
  zones: Array<{
    sido: string;
    sigungu: string;
    effectiveFrom: string;
  }>;
}
