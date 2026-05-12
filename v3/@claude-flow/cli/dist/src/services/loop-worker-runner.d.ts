/**
 * ADR-091 Phase 2 -- Stateless Loop Worker Runner
 *
 * Designed for /loop execution: runs a single worker iteration and returns
 * metadata that the caller can use with ScheduleWakeup.
 */
export interface LoopWorkerResult {
    workerType: string;
    success: boolean;
    suggestedDelay: number;
    reason: string;
    loopPrompt: string;
    metrics?: Record<string, unknown>;
}
export declare function runLoopWorker(workerType: string): Promise<LoopWorkerResult>;
//# sourceMappingURL=loop-worker-runner.d.ts.map