export type FunnelEventName =
  | "view_home"
  | "search_submitted"
  | "search_result_clicked"
  | "view_free_dashboard"
  | "start_payment"
  | "payment_success"
  | "request_ai_summary";

export interface FunnelEvent {
  eventName: FunnelEventName;
  sessionId: string;
  userId?: string;
  propertyId?: string;
  reportId?: string;
  payload?: Record<string, unknown>;
  at: string;
}

const events: FunnelEvent[] = [];

export function appendEvent(event: Omit<FunnelEvent, "at">): FunnelEvent {
  const row: FunnelEvent = { ...event, at: new Date().toISOString() };
  events.push(row);
  return row;
}

export function listEvents(limit = 100): FunnelEvent[] {
  return events.slice(-limit);
}

export function clearEvents() {
  events.splice(0, events.length);
}
