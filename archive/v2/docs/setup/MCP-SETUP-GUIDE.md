# MCP Server Setup Guide for Ruflo

## 🎯 Overview

Ruflo integrates with OpenClaw through MCP (Model Context Protocol) servers. This guide explains how to set up MCP servers correctly.

## 📋 Two Ways to Initialize

### 1. **Automatic Setup (Recommended)**

```bash
# This command automatically adds MCP servers
ruflo init --force
```

**What it does:**
- Creates project files (OPENCLAW.md, settings.json, etc.)
- Automatically runs: `openclaw mcp add ruflo ruflo mcp start`
- Sets up ruv-swarm and flow-nexus MCP servers (optional)
- Configures hooks and permissions

### 2. **Manual Setup**

If you already have OpenClaw installed but need to add MCP servers:

```bash
# Add Ruflo MCP server
openclaw mcp add ruflo ruflo mcp start

# Optional: Add enhanced coordination
openclaw mcp add ruv-swarm npx ruv-swarm mcp start

# Optional: Add cloud features
openclaw mcp add flow-nexus npx flow-nexus@latest mcp start
```

## ✅ Verify Setup

Check that MCP servers are running:

```bash
openclaw mcp list
```

Expected output:
```
ruflo: ruflo mcp start - ✓ Connected
ruv-swarm: npx ruv-swarm mcp start - ✓ Connected
flow-nexus: npx flow-nexus@latest mcp start - ✓ Connected
```

## 🔧 Troubleshooting

### Issue: MCP server shows local path instead of npx

**Example:**
```
ruflo: /workspaces/openclaw-flow/bin/claude-flow mcp start - ✓ Connected
```

**Solution:**
This happens when you're working in the ruflo repository itself. It's actually fine for development! The MCP server will work correctly.

If you want to use the npx command instead:

```bash
# Remove the existing server
openclaw mcp remove ruflo

# Re-add with npx command
openclaw mcp add ruflo ruflo mcp start
```

### Issue: "claude: command not found"

**Solution:**
Install OpenClaw first:

```bash
npm install -g @anthropic-ai/openclaw
```

### Issue: MCP server fails to connect

**Causes and Solutions:**

1. **Package not installed globally:**
   ```bash
   # Install the package
   npm install -g github:snowzlm/ruflo
   ```

2. **Using local development version:**
   ```bash
   # In the ruflo repo, build first
   npm run build
   ```

3. **Permission issues:**
   ```bash
   # Use --dangerously-skip-permissions for testing
   claude --dangerously-skip-permissions
   ```

## 📚 Understanding the Commands

### `ruflo init`
- Initializes Ruflo project files
- **Automatically calls** `openclaw mcp add` for you
- Only needs to be run once per project

### `claude init`
- OpenClaw's own initialization
- Does **NOT** automatically add Ruflo MCP servers
- Separate from Ruflo initialization

### `openclaw mcp add <name> <command>`
- Adds an MCP server to OpenClaw's global config
- Persists across projects
- Located in `~/.config/claude/`

## 🎯 Recommended Workflow

```bash
# 1. Install OpenClaw (one-time)
npm install -g @anthropic-ai/openclaw

# 2. Initialize your project with Ruflo (per project)
cd your-project
ruflo init --force

# 3. Verify MCP servers are connected
openclaw mcp list

# 4. Start using OpenClaw with MCP tools
claude
```

## 💡 Key Points

- **`ruflo init`** does BOTH file setup AND MCP configuration
- **`claude init`** is just for OpenClaw, not Ruflo
- MCP servers are **global** (affect all OpenClaw sessions)
- Project files (.claude/, OPENCLAW.md) are **local** to each project

## 🔗 Related Documentation

- [Installation Guide](../setup/remote-setup.md)
- [Environment Setup](../setup/ENV-SETUP-GUIDE.md)
- [MCP Tools Reference](../reference/MCP_TOOLS.md)

---

**Questions?** See [GitHub Issues](https://github.com/snowzlm/ruflo/issues) or join our [Discord](https://discord.com/invite/dfxmpwkG2D)
