export type HealthState = 'ok' | 'down' | 'unconfigured' | 'unknown';

export interface SourceStatus {
  state: HealthState;
  lastCheckedAt: number | null;
  lastSuccessAt: number | null;
  message: string | null;
}

type Source = 'esana' | 'newsdata';

const initial = (): SourceStatus => ({
  state: 'unknown',
  lastCheckedAt: null,
  lastSuccessAt: null,
  message: null,
});

/**
 * Module-level state, reset when the server process restarts. This is
 * deliberately passive — it only reflects activity that happened anyway
 * (a real page load), never an active probe made just to check status.
 * Given how easily these APIs rate-limit, a /status page that "pings"
 * them on every visit would be part of the problem, not a diagnostic
 * tool for it.
 */
const registry: Record<Source, SourceStatus> = {
  esana: initial(),
  newsdata: initial(),
};

export function reportSuccess(source: Source) {
  const now = Date.now();
  registry[source] = { state: 'ok', lastCheckedAt: now, lastSuccessAt: now, message: null };
}

export function reportFailure(source: Source, message: string) {
  const previous = registry[source];
  registry[source] = {
    state: 'down',
    lastCheckedAt: Date.now(),
    lastSuccessAt: previous.lastSuccessAt,
    message,
  };
}

export function reportUnconfigured(source: Source, message: string) {
  const previous = registry[source];
  registry[source] = {
    state: 'unconfigured',
    lastCheckedAt: Date.now(),
    lastSuccessAt: previous.lastSuccessAt,
    message,
  };
}

export function getStatusSnapshot(): Record<Source, SourceStatus> {
  return { esana: { ...registry.esana }, newsdata: { ...registry.newsdata } };
}
