/**
 * NDJSON Event Stream for CLI --stream mode
 *
 * Emits newline-delimited JSON events to stdout for consumption
 * by Claude Code's Monitor tool. Each event includes schema versioning.
 *
 * @see ADR-091: NDJSON event streaming infrastructure
 */
import { randomBytes } from 'crypto';
/** Generate a short unique run ID (e.g. run_m1abc_3f2a1b) */
export function createRunId() {
    return `run_${Date.now().toString(36)}_${randomBytes(3).toString('hex')}`;
}
/** Write one NDJSON line to stdout with schema and timestamp auto-populated */
export function emitEvent(event) {
    const full = Object.assign({ schema: 'ruflo.event.v1', ts: new Date().toISOString() }, event);
    process.stdout.write(JSON.stringify(full) + '\n');
}
/** Convenience wrapper that binds a runId to an emitter */
export function createEventEmitter(runId) {
    return {
        emit(event, data) {
            emitEvent({ runId, event, ...data });
        },
    };
}
//# sourceMappingURL=event-stream.js.map