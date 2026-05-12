/**
 * ADR-091 Phase 1 -- Runtime Capabilities Detection
 *
 * Detects the host environment and exposes which execution primitives are
 * available so that higher-level services can choose the right path:
 *   1. claude-code-native  -- full Claude Code tooling (loop, monitor, cron, teams)
 *   2. mcp-fallback        -- MCP transport active but native tools missing
 *   3. ci-daemon           -- headless / CI, use detached daemon
 */
export interface RuntimeCapabilities {
    loop: boolean;
    monitor: boolean;
    cron: boolean;
    teams: boolean;
    worktreeIsolation: boolean;
    pushNotification: boolean;
}
export type RuntimeTier = 'claude-code-native' | 'mcp-fallback' | 'ci-daemon';
export declare function detectCapabilities(): RuntimeCapabilities;
export declare function getRuntimeTier(): RuntimeTier;
export declare function getCacheWarmDelay(providerCacheTtlSeconds?: number): number;
//# sourceMappingURL=runtime-capabilities.d.ts.map