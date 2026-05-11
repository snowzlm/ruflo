#!/bin/bash
# Setup MCP server for Claude Flow

echo "🚀 Setting up Claude Flow MCP server..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "❌ Error: OpenClaw CLI not found"
    echo "Please install OpenClaw first"
    exit 1
fi

# Add MCP server
echo "📦 Adding Claude Flow MCP server..."
openclaw mcp add claude-flow npx claude-flow mcp start

echo "✅ MCP server setup complete!"
echo "🎯 You can now use mcp__claude-flow__ tools in OpenClaw"
