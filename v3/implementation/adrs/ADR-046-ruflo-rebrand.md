# ADR-046: Dual Umbrella Packages — ruflo + ruflo

**Status:** Accepted
**Date:** 2026-02-07
**Updated:** 2026-02-08
**Authors:** RuvNet, Ruflo Team

## Context

The umbrella package is published to npm as `ruflo`. As the ecosystem grows and the product establishes its own identity, a second umbrella package `ruflo` is introduced alongside the original.

### Current State

| Aspect | Current Value |
|--------|---------------|
| npm package | `ruflo` |
| CLI binary | `ruflo` |
| GitHub repo | snowzlm/ruflo |
| Internal packages | @claude-flow/* |
| Weekly downloads | ~1,000+ |

### Drivers for Change

1. **Brand Cohesion**: Aligns with the ruv ecosystem (ruv.io, @ruvector/*, ruv-swarm)
2. **Trademark Safety**: Removes potential trademark concerns with "Claude" in product name
3. **Product Identity**: Establishes independent product identity beyond Claude integration
4. **Discoverability**: "ruflo" is unique, memorable, and searchable
5. **Future Flexibility**: Enables the platform to support multiple AI backends without name confusion
6. **Zero Disruption**: Keeping `ruflo` ensures no existing users are broken

## Decision

Publish **two independent npm umbrella packages** — `ruflo` (original) and `ruflo` (new) — both backed by `@claude-flow/cli`.

### Package Architecture

```
npm registry
├── ruflo          ← original umbrella (bundles @claude-flow/cli)
│   └── bin: ruflo → v3/@claude-flow/cli/bin/cli.js
├── ruflo              ← new umbrella (depends on @claude-flow/cli)
│   └── bin: ruflo     → @claude-flow/cli/bin/cli.js
└── @claude-flow/cli     ← shared CLI implementation
```

### What Changes

| Aspect | Before | After |
|--------|--------|-------|
| npm packages | `ruflo` only | `ruflo` + `ruflo` |
| CLI binaries | `ruflo` | `ruflo` + `ruflo` |
| Install commands | `ruflo` | Both `ruflo` and `npx ruflo@latest` |
| README branding | "Claude-Flow" | "Ruflo" (primary), "ruflo" (supported) |
| Product name | Claude-Flow | Ruflo (with ruflo alias) |

### What Stays the Same

| Aspect | Value | Reason |
|--------|-------|--------|
| GitHub repo | snowzlm/ruflo | SEO, existing links, history |
| Internal packages | @claude-flow/* | Minimal disruption, existing integrations |
| Functionality | All features | No functional changes |
| License | MIT | No change |
| Author | RuvNet | No change |
| `ruflo` npm package | Fully supported | No breaking changes for existing users |

## Consequences

### Positive

1. **Zero Disruption**: Existing `ruflo` users unaffected
2. **Unified Brand**: New `ruflo` package for the ruv ecosystem
3. **Trademark Safety**: Users can choose the non-"Claude" branded package
4. **Dual Discovery**: Package discoverable under both names on npm
5. **Future Proof**: Can add non-Claude integrations without name confusion

### Negative

1. **Two packages to maintain**: Must publish and tag both packages
2. **Documentation**: Must reference both package names
3. **Download split**: npm download stats split across two packages

### Neutral

1. **GitHub repo unchanged**: Existing links continue to work
2. **Internal packages unchanged**: No code changes required in @claude-flow/*

## Implementation

### Package Structure

```
/workspaces/claude-flow/
├── package.json            # name: "ruflo" (original umbrella)
│                           # bin: ruflo → v3/@claude-flow/cli/bin/cli.js
│                           # bundles CLI files directly
└── ruflo/
    ├── package.json        # name: "ruflo" (new umbrella)
    │                       # bin: ruflo → ./bin/ruflo.js
    │                       # depends on @claude-flow/cli
    ├── bin/
    │   └── ruflo.js      # thin wrapper, imports @claude-flow/cli
    └── README.md           # Ruflo-branded docs
```

### Phase 1: Preparation (This PR)

1. Create ADR-046 (this document)
2. Keep root `package.json` as `ruflo` (original umbrella)
3. Create `ruflo/` directory with new umbrella package
4. Update main README.md with Ruflo branding
5. Update install scripts to reference `ruflo`

### Phase 2: Publishing

```bash
# 1. Publish @claude-flow/cli (shared implementation)
cd v3/@claude-flow/cli
npm publish --tag alpha

# 2. Publish ruflo umbrella (original)
cd /workspaces/claude-flow
npm publish --tag v3alpha
npm dist-tag add ruflo@<version> latest
npm dist-tag add ruflo@<version> alpha

# 3. Publish ruflo umbrella (new)
cd /workspaces/claude-flow/ruflo
npm publish --tag alpha
npm dist-tag add ruflo@<version> latest
```

### Phase 3: Ongoing

1. Both packages maintained indefinitely
2. Version numbers kept in sync
3. README shows both install options
4. `ruflo` promoted as primary in new documentation

## Publishing Checklist

When publishing updates, **all three packages** must be published:

| Order | Package | Command | Tags |
|-------|---------|---------|------|
| 1 | `@claude-flow/cli` | `npm publish --tag alpha` | alpha, latest |
| 2 | `ruflo` | `npm publish --tag v3alpha` | v3alpha, alpha, latest |
| 3 | `ruflo` | `npm publish --tag alpha` | alpha, latest |

## Alternatives Considered

### 1. Replace ruflo with ruflo (single package)

**Pros:** Simpler, one package to maintain
**Cons:** Breaks existing users, loses download history
**Decision:** Rejected - zero disruption preferred

### 2. Rename to ruv-flow (hyphenated)

**Pros:** Matches ruv-swarm pattern
**Cons:** Inconsistent with @ruvector (no hyphen)
**Decision:** Rejected - "ruflo" is cleaner and matches ruvector pattern

### 3. Rename internal packages too (@ruflo/*)

**Pros:** Complete rebrand
**Cons:** Major breaking change, complex migration, npm scope registration
**Decision:** Rejected - disruption not worth the benefit

### 4. Deprecate ruflo

**Pros:** Forces migration to ruflo
**Cons:** Breaks existing users, bad developer experience
**Decision:** Rejected - both packages coexist permanently

## Migration Guide

### For New Users

```bash
# Recommended
npx ruflo@latest init --wizard

# Also works
ruflo init --wizard
```

### For Existing Users

No migration required. `ruflo` continues to work. Optionally switch:

```bash
# Switch MCP server (optional)
openclaw mcp remove ruflo
openclaw mcp add ruflo npx ruflo@latest mcp start
```

### For Contributors

1. Root `package.json` is the `ruflo` umbrella
2. `ruflo/package.json` is the `ruflo` umbrella
3. Internal imports remain `@claude-flow/*`
4. GitHub repo remains `snowzlm/ruflo`

## Metrics for Success

| Metric | Target | Measurement |
|--------|--------|-------------|
| Combined npm downloads | Maintain or grow | npm weekly stats (both packages) |
| GitHub stars | Maintain or grow | GitHub metrics |
| Issues from confusion | < 10 in 30 days | GitHub issues |
| ruflo adoption | 50%+ new installs in 90 days | npm stats |

## References

- GitHub Issue: #1101
- npm: https://npmjs.com/package/ruflo
- npm: https://npmjs.com/package/claude-flow
- Related: ADR-017 (RuVector Integration)

## Appendix: Branding Guidelines

### Product Names

| Context | Use |
|---------|-----|
| npm packages | `ruflo` and `ruflo` (both lowercase) |
| README title | "Ruflo" (PascalCase) |
| CLI binaries | `ruflo` or `ruflo` (both lowercase) |
| In prose | "Ruflo" (PascalCase) |

### Command Examples

```bash
# New recommended style
npx ruflo@latest init
npx ruflo@latest agent spawn -t coder
npx ruflo@latest swarm init --topology hierarchical

# Legacy style (still fully supported)
ruflo init
ruflo agent spawn -t coder
```

---

**Decision Date:** 2026-02-07
**Updated:** 2026-02-08
**Review Date:** 2026-03-07 (30 days post-implementation)
