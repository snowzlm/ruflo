---
name: claude-flow-help
description: Show Claude-Flow commands and usage with batchtools optimization
---

# Claude-Flow Commands (Batchtools Optimized)

## Core Commands with Batch Operations

### System Management (Batch Operations)

- `npx ruflo start` - Start orchestration system
- `npx ruflo status` - Check system status
- `npx ruflo monitor` - Real-time monitoring
- `npx ruflo stop` - Stop orchestration

**Batch Operations:**

```bash
# Check multiple system components in parallel
npx ruflo batch status --components "agents,tasks,memory,connections"

# Start multiple services concurrently
npx ruflo batch start --services "monitor,scheduler,coordinator"
```

### Agent Management (Parallel Operations)

- `npx ruflo agent spawn <type>` - Create new agent
- `npx ruflo agent list` - List active agents
- `npx ruflo agent info <id>` - Agent details
- `npx ruflo agent terminate <id>` - Stop agent

**Batch Operations:**

```bash
# Spawn multiple agents in parallel
npx ruflo agent batch-spawn "code:3,test:2,review:1"

# Get info for multiple agents concurrently
npx ruflo agent batch-info "agent1,agent2,agent3"

# Terminate multiple agents
npx ruflo agent batch-terminate --pattern "test-*"
```

### Task Management (Concurrent Processing)

- `npx ruflo task create <type> "description"` - Create task
- `npx ruflo task list` - List all tasks
- `npx ruflo task status <id>` - Task status
- `npx ruflo task cancel <id>` - Cancel task

**Batch Operations:**

```bash
# Create multiple tasks from file
npx ruflo task batch-create tasks.json

# Check status of multiple tasks concurrently
npx ruflo task batch-status --ids "task1,task2,task3"

# Process task queue in parallel
npx ruflo task process-queue --parallel 5
```

### Memory Operations (Bulk Processing)

- `npx ruflo memory store "key" "value"` - Store data
- `npx ruflo memory query "search"` - Search memory
- `npx ruflo memory stats` - Memory statistics
- `npx ruflo memory export <file>` - Export memory

**Batch Operations:**

```bash
# Bulk store from JSON file
npx ruflo memory batch-store data.json

# Parallel query across namespaces
npx ruflo memory batch-query "search term" --namespaces "all"

# Export multiple namespaces concurrently
npx ruflo memory batch-export --namespaces "project,agents,tasks"
```

### SPARC Development (Parallel Workflows)

- `npx ruflo sparc modes` - List SPARC modes
- `npx ruflo sparc run <mode> "task"` - Run mode
- `npx ruflo sparc tdd "feature"` - TDD workflow
- `npx ruflo sparc info <mode>` - Mode details

**Batch Operations:**

```bash
# Run multiple SPARC modes in parallel
npx ruflo sparc batch-run --modes "spec:task1,architect:task2,code:task3"

# Execute parallel TDD for multiple features
npx ruflo sparc batch-tdd features.json

# Analyze multiple components concurrently
npx ruflo sparc batch-analyze --components "auth,api,database"
```

### Swarm Coordination (Enhanced Parallelization)

- `npx ruflo swarm "task" --strategy <type>` - Start swarm
- `npx ruflo swarm "task" --background` - Long-running swarm
- `npx ruflo swarm "task" --monitor` - With monitoring

**Batch Operations:**

```bash
# Launch multiple swarms for different components
npx ruflo swarm batch --config swarms.json

# Coordinate parallel swarm strategies
npx ruflo swarm multi-strategy "project" --strategies "dev:frontend,test:backend,docs:api"
```

## Advanced Batch Examples

### Parallel Development Workflow:

```bash
# Initialize complete project setup in parallel
npx ruflo batch init --actions "memory:setup,agents:spawn,tasks:queue"

# Run comprehensive analysis
npx ruflo batch analyze --targets "code:quality,security:audit,performance:profile"
```

### Concurrent Testing Suite:

```bash
# Execute parallel test suites
npx ruflo sparc batch-test --suites "unit,integration,e2e" --parallel

# Generate reports concurrently
npx ruflo batch report --types "coverage,performance,security"
```

### Bulk Operations:

```bash
# Process multiple files in parallel
npx ruflo batch process --files "*.ts" --action "lint,format,analyze"

# Parallel code generation
npx ruflo batch generate --templates "api:users,api:products,api:orders"
```

## Performance Tips

- Use `--parallel` flag for concurrent operations
- Batch similar operations to reduce overhead
- Leverage `--async` for non-blocking execution
- Use `--stream` for real-time progress updates
- Enable `--cache` for repeated operations

## Monitoring Batch Operations

```bash
# Real-time batch monitoring
npx ruflo monitor --batch

# Batch operation statistics
npx ruflo stats --batch-ops

# Performance profiling
npx ruflo profile --batch-execution
```
