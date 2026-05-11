---
name: claude-flow-memory
description: Interact with Claude-Flow memory system using batchtools optimization
---

# Claude-Flow Memory System (Batchtools Optimized)

The memory system provides persistent storage with enhanced batch operations for efficient cross-session and cross-agent collaboration.

## Batch Store Operations

```bash
# Single store (traditional)
npx ruflo memory store "key" "value" --namespace project

# Batch store multiple key-value pairs
npx ruflo memory batch-store --data '{
  "project_specs": "e-commerce platform requirements",
  "api_design": "RESTful API architecture",
  "db_schema": "PostgreSQL database design"
}' --namespace project

# Bulk import from file
npx ruflo memory bulk-import data.json --parallel
```

## Parallel Query Operations

```bash
# Single query (traditional)
npx ruflo memory query "search term" --limit 10

# Parallel multi-term search
npx ruflo memory batch-query --terms "api,database,authentication" --parallel

# Cross-namespace parallel search
npx ruflo memory multi-query "pattern" --namespaces "all" --concurrent
```

## Batch Statistics & Analysis

```bash
# Comprehensive stats across all namespaces
npx ruflo memory batch-stats --detailed --parallel

# Analyze memory usage patterns
npx ruflo memory analyze --patterns --concurrent

# Generate usage reports
npx ruflo memory batch-report --format "json,csv,html"
```

## Bulk Export/Import Operations

```bash
# Export multiple namespaces concurrently
npx ruflo memory batch-export --namespaces "project,agents,tasks" --output exports/

# Parallel import with validation
npx ruflo memory batch-import --files "*.json" --validate --parallel

# Incremental backup with compression
npx ruflo memory backup --incremental --compress --parallel
```

## Enhanced Namespace Operations

```bash
# Create multiple namespaces
npx ruflo memory batch-create-ns "feature1,feature2,feature3"

# Clone namespaces in parallel
npx ruflo memory batch-clone --source project --targets "dev,test,prod"

# Merge namespaces concurrently
npx ruflo memory batch-merge --sources "temp1,temp2" --target main
```

## Advanced Batch Operations

### Parallel Data Processing

```bash
# Transform data across namespaces
npx ruflo memory batch-transform --operation "encrypt" --namespaces "sensitive"

# Aggregate data from multiple sources
npx ruflo memory batch-aggregate --sources "logs,metrics,events" --operation "summarize"
```

### Concurrent Synchronization

```bash
# Sync memory across agents
npx ruflo memory batch-sync --agents "all" --bidirectional

# Replicate to remote storage
npx ruflo memory batch-replicate --destinations "s3,gcs" --parallel
```

### Bulk Cleanup Operations

```bash
# Clean old data in parallel
npx ruflo memory batch-clean --older-than "30d" --namespaces "all"

# Optimize storage concurrently
npx ruflo memory batch-optimize --compact --dedupe --parallel
```

## Performance Optimizations

### Batch Read Operations

```bash
# Prefetch related data
npx ruflo memory batch-prefetch --keys "user_*" --cache

# Parallel read with fallback
npx ruflo memory batch-read --keys-file keys.txt --fallback-ns default
```

### Batch Write Operations

```bash
# Atomic batch writes
npx ruflo memory batch-write --atomic --data updates.json

# Conditional batch updates
npx ruflo memory batch-update --if-exists --data changes.json
```

## Monitoring & Analytics

### Real-time Batch Monitoring

```bash
# Monitor batch operations
npx ruflo memory monitor --batch-ops --real-time

# Track memory usage patterns
npx ruflo memory track --patterns --visualize
```

### Performance Analysis

```bash
# Analyze batch operation performance
npx ruflo memory perf-analyze --operations "read,write,query"

# Generate optimization recommendations
npx ruflo memory optimize-suggest --based-on-usage
```

## Best Practices for Batch Operations

- Use `--parallel` for independent operations
- Enable `--atomic` for data consistency
- Leverage `--cache` for repeated reads
- Use `--stream` for large datasets
- Enable `--compress` for network transfers
- Set `--batch-size` based on memory limits
- Use `--retry` for resilient operations
- Enable `--validate` for data integrity

## Examples of Complex Workflows

### Project Initialization

```bash
# Initialize complete project memory in parallel
npx ruflo memory batch-init --template "web-app" --namespaces "specs,arch,impl,tests"
```

### Data Migration

```bash
# Migrate data between formats
npx ruflo memory batch-migrate --from "v1" --to "v2" --transform migrate.js --parallel
```

### Distributed Processing

```bash
# Process memory data across multiple workers
npx ruflo memory distribute --operation "analyze" --workers 4 --queue-size 1000
```
