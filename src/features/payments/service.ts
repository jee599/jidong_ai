import { paymentRepo, reportRepo } from "@/src/db/memory-store";
import type { PaymentRow } from "@/src/db/types";

export const PAID_SUMMARY_PRICE_KRW = 19_900;

export function createPaymentIntent(reportId: string, userId: string): PaymentRow {
  const report = reportRepo.getById(reportId);
  if (!report) {
    throw new Error("report not found");
  }
  if (report.userId !== userId) {
    throw new Error("report access denied");
  }
  return paymentRepo.create({
    reportId,
    userId,
    amountKrw: PAID_SUMMARY_PRICE_KRW,
    currency: "KRW",
    status: "ready_to_pay",
    provider: "mock",
    providerRef: null
  });
}

export function confirmMockPayment(paymentId: string, userId: string): PaymentRow {
  const payment = paymentRepo.getById(paymentId);
  if (!payment) {
    throw new Error("payment not found");
  }
  if (payment.userId !== userId) {
    throw new Error("payment access denied");
  }
  const updated = paymentRepo.updateStatus(paymentId, "paid", `mock-${Date.now()}`);
  if (!updated) {
    throw new Error("payment update failed");
  }
  return updated;
}

export function getPaidPaymentByReport(reportId: string, userId: string): PaymentRow | null {
  const matched = paymentRepo.listByReportAndUser(reportId, userId);
  return matched.find((item) => item.status === "paid") ?? null;
}
