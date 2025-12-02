#!/bin/bash

# MCP Weather Server - Auto Install to Claude Desktop
# This script automatically configures the weather server in Claude Desktop

set -e

echo "🌤️  MCP Weather Server - Auto Installer"
echo "========================================"
echo ""

# Get the absolute path of this script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_PATH="$SCRIPT_DIR/dist/index.js"

# Claude Desktop config path (macOS)
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

echo "📍 Project directory: $SCRIPT_DIR"
echo "📍 Server path: $SERVER_PATH"
echo "📍 Claude config: $CLAUDE_CONFIG_FILE"
echo ""

# Step 1: Check if server is built
echo "🔍 Checking if server is built..."
if [ ! -f "$SERVER_PATH" ]; then
    echo "❌ Server not found. Building now..."
    pnpm run build
    echo "✅ Server built successfully!"
else
    echo "✅ Server already built"
fi
echo ""

# Step 2: Create Claude config directory if it doesn't exist
echo "📁 Checking Claude Desktop config directory..."
if [ ! -d "$CLAUDE_CONFIG_DIR" ]; then
    echo "⚠️  Claude Desktop config directory not found at:"
    echo "   $CLAUDE_CONFIG_DIR"
    echo ""
    echo "Please install Claude Desktop first:"
    echo "   https://claude.ai/download"
    exit 1
fi
echo "✅ Claude Desktop config directory found"
echo ""

# Step 3: Backup existing config if it exists
if [ -f "$CLAUDE_CONFIG_FILE" ]; then
    BACKUP_FILE="${CLAUDE_CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "💾 Backing up existing config to:"
    echo "   $BACKUP_FILE"
    cp "$CLAUDE_CONFIG_FILE" "$BACKUP_FILE"
    echo "✅ Backup created"
    echo ""
fi

# Step 4: Update or create config
echo "⚙️  Configuring MCP server..."

# Create the new server entry
NEW_SERVER_CONFIG=$(cat <<EOF
{
  "command": "node",
  "args": [
    "$SERVER_PATH"
  ]
}
EOF
)

# If config file exists, merge with existing config
if [ -f "$CLAUDE_CONFIG_FILE" ]; then
    # Use Python to merge JSON (more reliable than jq on macOS)
    python3 <<PYTHON_SCRIPT
import json
import sys

config_file = "$CLAUDE_CONFIG_FILE"
server_path = "$SERVER_PATH"

try:
    with open(config_file, 'r') as f:
        config = json.load(f)
except:
    config = {}

# Ensure mcpServers exists
if 'mcpServers' not in config:
    config['mcpServers'] = {}

# Add or update weather server
config['mcpServers']['weather'] = {
    'command': 'node',
    'args': [server_path]
}

# Write back
with open(config_file, 'w') as f:
    json.dump(config, f, indent=2)

print("✅ Config updated successfully")
PYTHON_SCRIPT
else
    # Create new config file
    cat > "$CLAUDE_CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": [
        "$SERVER_PATH"
      ]
    }
  }
}
EOF
    echo "✅ New config file created"
fi
echo ""

# Step 5: Verify installation
echo "🔍 Verifying installation..."
if grep -q "weather" "$CLAUDE_CONFIG_FILE"; then
    echo "✅ Weather server configured successfully!"
else
    echo "❌ Configuration may have failed. Please check manually."
    exit 1
fi
echo ""

# Step 6: Display config
echo "📄 Current configuration:"
echo "----------------------------------------"
cat "$CLAUDE_CONFIG_FILE"
echo "----------------------------------------"
echo ""

# Step 7: Final instructions
echo "🎉 Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Restart Claude Desktop (Cmd+Q then reopen)"
echo "2. Look for the 🔌 tools indicator in Claude"
echo "3. Try asking: 'What are the weather alerts in California?'"
echo ""
echo "📚 For more info, see: docs/SETUP_GUIDE.md"
echo ""
echo "Happy weather tracking! 🌤️"
