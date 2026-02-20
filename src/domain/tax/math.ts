export const KRW_PER_EOK = 100_000_000n;
export const PPM_BASE = 1_000_000n;

export function toBigIntKrw(value: number): bigint {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("purchasePriceKrw must be a non-negative integer");
  }
  return BigInt(value);
}

export function mulByRatePpm(value: bigint, ratePpm: number): bigint {
  return divRound(value * BigInt(ratePpm), PPM_BASE);
}

export function divRound(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) {
    throw new Error("denominator must not be zero");
  }
  const half = denominator / 2n;
  return (numerator + half) / denominator;
}

export function ratePpmToPercent(ratePpm: bigint): string {
  const scaled = divRound(ratePpm * 10_000n, 10_000n);
  const intPart = scaled / 10_000n;
  const fraction = (scaled % 10_000n).toString().padStart(4, "0");
  return `${intPart}.${fraction}`;
}
