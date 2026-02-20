import { NextResponse } from "next/server";
import { confirmMockPayment } from "@/src/features/payments/service";
import { getAuthUser } from "@/src/lib/auth";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";

const PAYMENT_META = { basisDate: "2026-02-01", policyVersion: "payment-flow-mock-v1" };

interface PaymentConfirmRequest {
  paymentId: string;
}

export async function POST(req: Request) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(errorEnvelope("로그인이 필요합니다.", PAYMENT_META), { status: 401 });
    }
    const body = (await req.json()) as PaymentConfirmRequest;
    if (!body.paymentId?.trim()) {
      return NextResponse.json(errorEnvelope("paymentId가 필요합니다.", PAYMENT_META), { status: 400 });
    }
    const payment = confirmMockPayment(body.paymentId.trim(), user.userId);
    return NextResponse.json(
      envelope(
        {
          paymentId: payment.id,
          status: payment.status,
          providerRef: payment.providerRef
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
