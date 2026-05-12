/**
 * NDJSON Event Stream for CLI --stream mode
 *
 * Emits newline-delimited JSON events to stdout for consumption
 * by Claude Code's Monitor tool. Each event includes schema versioning.
 *
 * @see ADR-091: NDJSON event streaming infrastructure
 */
export interface StreamEvent {
    schema: 'ruflo.event.v1';
    event: string;
    runId: string;
    agentId?: string;
    ts: string;
    [key: string]: unknown;
}
/** Generate a short unique run ID (e.g. run_m1abc_3f2a1b) */
export declare function createRunId(): string;
/** Write one NDJSON line to stdout with schema and timestamp auto-populated */
export declare function emitEvent(event: Omit<StreamEvent, 'schema' | 'ts'>): void;
/** Convenience wrapper that binds a runId to an emitter */
export declare function createEventEmitter(runId: string): {
    emit(event: string, data?: Record<string, unknown>): void;
};
//# sourceMappingURL=event-stream.d.ts.map