# Git Checkpoint System Demo

This example demonstrates how to use the automatic Git checkpoint system with OpenClaw.

## Quick Setup

```bash
# Run the setup script
./.openclaw/helpers/setup-checkpoints.sh

# Choose option 1 for simple checkpoints or option 2 for advanced features
```

## How It Works

### 1. Pre-Edit Checkpoints
Before editing any file, Claude automatically creates a checkpoint:
- Creates a Git stash of current changes
- Creates a checkpoint branch
- Stores metadata in `.openclaw/checkpoints/`

### 2. Post-Edit Checkpoints
After editing a file, Claude:
- Commits the changes with a descriptive message
- Creates a Git tag for easy reference
- Updates checkpoint metadata

### 3. Task Checkpoints
When you submit a new task, Claude:
- Creates a checkpoint of the current state
- Includes task description in commit message
- Optionally creates GitHub releases (advanced mode)

### 4. Session End Checkpoints
When ending a Claude session:
- Creates a final checkpoint
- Generates a session summary
- Lists all checkpoints created during the session

## Example Workflow

```bash
# 1. Start OpenClaw with checkpoints enabled
claude --settings .claude/settings-checkpoint-simple.json

# 2. Work on your project
# Claude will automatically create checkpoints

# 3. List all checkpoints
git tag -l 'checkpoint-*' | sort -r

# 4. View checkpoint details
./.openclaw/helpers/checkpoint-manager.sh show checkpoint-20240130-143022

# 5. Compare current state with a checkpoint
./.openclaw/helpers/checkpoint-manager.sh diff checkpoint-20240130-143022

# 6. Rollback to a checkpoint if needed
./.openclaw/helpers/checkpoint-manager.sh rollback checkpoint-20240130-143022
```

## Checkpoint Manager Commands

```bash
# List all checkpoints
./.openclaw/helpers/checkpoint-manager.sh list

# Show checkpoint details
./.openclaw/helpers/checkpoint-manager.sh show <checkpoint-name>

# Rollback to checkpoint
./.openclaw/helpers/checkpoint-manager.sh rollback <checkpoint-name> [--branch|--reset|--stash]

# Compare with checkpoint
./.openclaw/helpers/checkpoint-manager.sh diff <checkpoint-name>

# Clean old checkpoints
./.openclaw/helpers/checkpoint-manager.sh clean [days]

# Generate summary report
./.openclaw/helpers/checkpoint-manager.sh summary
```

## Rollback Options

1. **Branch Rollback** (safest):
   ```bash
   ./.openclaw/helpers/checkpoint-manager.sh rollback checkpoint-20240130-143022 --branch
   ```
   Creates a new branch from the checkpoint

2. **Stash Rollback** (reversible):
   ```bash
   ./.openclaw/helpers/checkpoint-manager.sh rollback checkpoint-20240130-143022 --stash
   ```
   Stashes current changes before resetting

3. **Hard Reset** (destructive):
   ```bash
   ./.openclaw/helpers/checkpoint-manager.sh rollback checkpoint-20240130-143022 --reset
   ```
   ⚠️ Permanently discards current changes

## Advanced Features

### GitHub Integration
With the advanced configuration, you can:
- Create GitHub releases for major checkpoints
- Use GitHub CLI for enhanced tracking
- Generate release notes automatically

Enable by setting:
```bash
export CREATE_GH_RELEASE=true
```

### Custom Checkpoint Scripts
The system uses the `checkpoint-hooks.sh` script which can be customized:
- Modify checkpoint naming conventions
- Add custom metadata
- Integrate with other tools

## Tips

1. **Regular Cleanup**: Use `checkpoint-manager.sh clean 7` to remove checkpoints older than 7 days
2. **Session Summaries**: Check `.openclaw/checkpoints/summary-*.md` files for session overviews
3. **Metadata**: All checkpoint metadata is stored in `.openclaw/checkpoints/*.json`
4. **Git Integration**: All checkpoints are standard Git tags and branches

## Troubleshooting

### Checkpoint not created
- Ensure Git is initialized in your project
- Check that `jq` is installed
- Verify hooks are enabled in settings.json

### Cannot rollback
- Ensure you have committed or stashed current changes
- Check that the checkpoint exists with `git tag -l`
- Use `--stash` option to save current work

### JSON errors
- Use the simple configuration if you encounter JSON parsing issues
- Check that all quotes are properly escaped
- Validate JSON with `jq '.' .claude/settings.json`