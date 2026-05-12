export function logApiEvent(event: string, meta: Record<string, unknown>) {
  console.info(`[api] ${event}`, JSON.stringify(meta));
}
