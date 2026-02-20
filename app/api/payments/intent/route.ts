import { NextResponse } from "next/server";
import { createPaymentIntent } from "@/src/features/payments/service";
import { getAuthUser } from "@/src/lib/auth";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";

const PAYMENT_META = { basisDate: "2026-02-01", policyVersion: "payment-flow-mock-v1" };

interface PaymentIntentRequest {
  reportId: string;
}

export async function POST(req: Request) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(errorEnvelope("결제를 진행하려면 로그인이 필요합니다.", PAYMENT_META), { status: 401 });
    }

    const body = (await req.json()) as PaymentIntentRequest;
    if (!body.reportId?.trim()) {
      return NextResponse.json(errorEnvelope("reportId가 필요합니다.", PAYMENT_META), { status: 400 });
    }

    const payment = createPaymentIntent(body.reportId.trim(), user.userId);
    return NextResponse.json(
      envelope(
        {
          paymentId: payment.id,
          reportId: payment.reportId,
          amountKrw: payment.amountKrw,
          status: payment.status
        },
        PAYMENT_META
      )
    );
  } catch (error) {
    return NextResponse.json(errorEnvelope(error instanceof Error ? error.message : "Unexpected error", PAYMENT_META), {
      status: 400
    });
  }
}
