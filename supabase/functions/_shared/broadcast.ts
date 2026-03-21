/**
 * Shared Broadcast Helper
 *
 * Fire-and-forget broadcast to Supabase Realtime channels.
 * Used by edge functions to push events to the frontend.
 * Never throws — errors are logged but don't block the caller.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Broadcast an event to a Realtime channel.
 *
 * @param supabase - Supabase client (service-role or user-scoped)
 * @param topic    - Channel topic, e.g. "sprint:abc-123:events"
 * @param event    - Event name in snake_case, e.g. "tasks_generated"
 * @param payload  - Event payload (timestamp added automatically)
 */
export async function broadcastEvent(
  supabase: SupabaseClient,
  topic: string,
  event: string,
  payload: Record<string, unknown> = {},
): Promise<void> {
  try {
    const channel = supabase.channel(topic);
    await channel.send({
      type: "broadcast",
      event,
      payload: { ...payload, timestamp: Date.now() },
    });
  } catch (error) {
    console.error(`[broadcast] Error sending ${event} to ${topic}:`, error);
  }
}
