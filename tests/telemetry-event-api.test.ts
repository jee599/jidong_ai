import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/telemetry/event/route";

describe("POST /api/telemetry/event", () => {
  it("accepts funnel event", async () => {
    const req = new Request("http://localhost/api/telemetry/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName: "search_submitted",
        sessionId: "session-1",
        payload: { queryLength: 3 }
      })
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.accepted).toBe(true);
    expect(body.meta).toMatchObject({
      basisDate: expect.any(String),
      policyVersion: expect.any(String)
    });
  });
});
