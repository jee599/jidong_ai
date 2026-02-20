import { NextResponse } from "next/server";
import { appendEvent } from "@/src/features/telemetry/store";
import { envelope, errorEnvelope } from "@/src/lib/api-envelope";

const TELEMETRY_META = { basisDate: "2026-02-01", policyVersion: "telemetry-funnel-v1" };

interface TelemetryPayload {
  eventName: "view_home" | "search_submitted" | "search_result_clicked" | "view_free_dashboard" | "start_payment" | "payment_success" | "request_ai_summary";
  sessionId: string;
  userId?: string;
  propertyId?: string;
  reportId?: string;
  payload?: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TelemetryPayload;
    if (!body.eventName || !body.sessionId) {
      return NextResponse.json(errorEnvelope("eventName/sessionId가 필요합니다.", TELEMETRY_META), { status: 400 });
    }
    const saved = appendEvent(body);
    return NextResponse.json(envelope({ accepted: true, at: saved.at }, TELEMETRY_META));
  } catch (error) {
    return NextResponse.json(
      errorEnvelope(error instanceof Error ? error.message : "Unexpected error", TELEMETRY_META),
      { status: 400 }
    );
  }
}
