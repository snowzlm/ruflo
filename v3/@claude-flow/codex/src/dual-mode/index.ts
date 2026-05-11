/**
 * Dual-Mode Module
 * Collaborative execution of OpenClaw + Codex workers
 */

export { DualModeOrchestrator, CollaborationTemplates } from './orchestrator.js';
export type {
  DualModeConfig,
  WorkerConfig,
  WorkerResult,
  CollaborationResult,
} from './orchestrator.js';

export { createDualModeCommand } from './cli.js';
