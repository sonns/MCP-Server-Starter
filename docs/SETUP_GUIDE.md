# MCP Weather Server - Setup Guide

## 🚀 Quick Setup for Claude Desktop & VS Code

### Step 1: Build the Server

```bash
cd /[path-to-project]/MCP-Server-Starter
pnpm install
pnpm run build
```

### Step 2: Configure Claude Desktop

#### On macOS:

1. **Locate the config file:**

   ```bash
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. **Edit the config file:**

   ```bash
   # Open with default editor
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Or use VS Code
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Or use nano
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **Add this configuration:**

   ```json
   {
     "mcpServers": {
       "weather": {
         "command": "node",
         "args": ["/[path-to-project]/MCP-Server-Starter/dist/index.js"]
       }
     }
   }
   ```

   **Note:** If you already have other MCP servers, just add the `weather` entry inside `mcpServers`.

#### On Windows:

1. **Locate the config file:**

   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Add the same configuration** (adjust path for Windows):
   ```json
   {
     "mcpServers": {
       "weather": {
         "command": "node",
         "args": ["C:\\Users\\YourUsername\\path\\to\\MCP-Server-Starter\\dist\\index.js"]
       }
     }
   }
   ```

### Step 3: Restart Claude Desktop

- Completely quit Claude Desktop (Cmd+Q on Mac)
- Reopen Claude Desktop

### Step 4: Verify Installation (Claude Desktop)

In Claude Desktop, you should see:

- A small "🔌" icon or tools indicator
- The server should connect automatically

---

## 🖥️ Setup for VS Code (Copilot Chat)

### Option 1: Workspace Configuration (Recommended)

1. **Create `.vscode/mcp.json` in your workspace:**

   ```json
   {
     "servers": {
       "mcp-server-starter": {
         "command": "node",
         "args": ["[path-to-project]/MCP-Server-Starter/dist/index.js"],
         "env": {
           "NWS_BASE_URL": "https://api.weather.gov",
           "GAROON_BASE_URL": "http://localhost:8080/cgi-bin/cbgrn/grn.cgi/",
           "GAROON_USERNAME": "Administrator",
           "GAROON_PASSWORD": "your-password"
         }
       }
     }
   }
   ```

2. **Restart VS Code** or reload the window (`Cmd+Shift+P` → "Developer: Reload Window")

### Option 2: User Settings Configuration

1. **Open VS Code Settings (JSON):**

   ```
   Cmd+Shift+P → "Preferences: Open User Settings (JSON)"
   ```

2. **Add MCP configuration:**

   ```json
   {
     "mcp": {
       "servers": {
         "mcp-server-starter": {
           "command": "node",
           "args": ["[path-to-project]/MCP-Server-Starter/dist/index.js"],
           "env": {
             "NWS_BASE_URL": "https://api.weather.gov",
             "GAROON_BASE_URL": "http://localhost:8080/cgi-bin/cbgrn/grn.cgi/",
             "GAROON_USERNAME": "Administrator",
             "GAROON_PASSWORD": "your-password"
           }
         }
       }
     }
   }
   ```

### Verify Installation (VS Code)

1. Open Copilot Chat (`Cmd+Shift+I` or click the Copilot icon)
2. The MCP server tools should be available in Agent mode
3. Try asking: "What's the weather forecast for San Francisco?"

### Key Differences: Claude Desktop vs VS Code

| Feature         | Claude Desktop               | VS Code                             |
| --------------- | ---------------------------- | ----------------------------------- |
| Config Key      | `"mcpServers"`               | `"servers"`                         |
| Config Location | `claude_desktop_config.json` | `.vscode/mcp.json` or User Settings |
| Restart         | Quit & Reopen app            | Reload Window                       |

---

## 🧪 Testing the Server

### Test 1: Weather Alerts

Ask Claude:

```
What are the current weather alerts in California?
```

Expected: Claude will use the `get-alerts` tool with state="CA"

### Test 2: Weather Forecast

Ask Claude:

```
What's the weather forecast for San Francisco? (coordinates: 37.7749, -122.4194)
```

Expected: Claude will use the `get-forecast` tool with the coordinates

### Test 3: Multiple States

Ask Claude:

```
Check weather alerts for Texas, Florida, and New York
```

Expected: Claude will call the tool multiple times

---

## 🐛 Troubleshooting

### Server not showing up?

1. **Check if server is built:**

   ```bash
   ls -la [path-to-project]/dist/index.js
   ```

2. **Test server manually:**

   ```bash
   node [path-to-project]/dist/index.js
   ```

   You should see:

   ```
   MCP Weather Server running on stdio
   Providing weather alerts and forecasts for US locations
   ```

3. **Check Claude Desktop logs:**

   ```bash
   # macOS
   tail -f ~/Library/Logs/Claude/mcp*.log

   # Or check all logs
   ls -la ~/Library/Logs/Claude/
   ```

### Permission errors?

Make sure the file is executable:

```bash
chmod +x [path-to-project]/dist/index.js
```

### Node not found?

Make sure Node.js is in PATH:

```bash
which node
# Should output: /usr/local/bin/node or similar

# If not found, use full path in config:
{
  "command": "/usr/local/bin/node",
  "args": ["[path-to-project]/dist/index.js"]
}
```

---

## 🔧 Alternative: Use pnpm start

Instead of calling node directly, you can use pnpm:

```json
{
  "mcpServers": {
    "weather": {
      "command": "pnpm",
      "args": ["start"],
      "cwd": "[path-to-project]"
    }
  }
}
```

---

## 📊 Development Mode

For development with auto-reload:

1. **In one terminal, run:**

   ```bash
   pnpm run dev
   ```

2. **Configure Claude Desktop to use the built version**

3. **After making changes:**
   - Save the file
   - Run `pnpm run build`
   - Restart Claude Desktop

---

## 🎯 Quick Reference: Common US Cities

| City          | State | Coordinates        |
| ------------- | ----- | ------------------ |
| San Francisco | CA    | 37.7749, -122.4194 |
| New York      | NY    | 40.7128, -74.0060  |
| Los Angeles   | CA    | 34.0522, -118.2437 |
| Chicago       | IL    | 41.8781, -87.6298  |
| Houston       | TX    | 29.7604, -95.3698  |
| Miami         | FL    | 25.7617, -80.1918  |
| Seattle       | WA    | 47.6062, -122.3321 |
| Boston        | MA    | 42.3601, -71.0589  |

---

## 🌟 Example Prompts for Claude

1. **"Are there any weather alerts in Texas right now?"**

2. **"What's the weather forecast for Seattle?"**
   - Claude might ask for coordinates, provide: 47.6062, -122.3321

3. **"Check if there are any severe weather warnings in Florida and California"**

4. **"Get me the 7-day forecast for Chicago (41.8781, -87.6298)"**

5. **"What's the weather like in New York City today?"**

---

## 📝 Notes

- The server only supports **US locations** (uses National Weather Service API)
- **No API key required** - completely free
- For international support, see [README.md](./README.md) for alternative APIs

---

## ✅ Verification Checklist

- [ ] Server built successfully (`pnpm run build`)
- [ ] Config file created at correct location
- [ ] Claude Desktop restarted
- [ ] Server appears in Claude Desktop tools
- [ ] Successfully called `get-alerts` tool
- [ ] Successfully called `get-forecast` tool

---

## 🆘 Need Help?

If you're still having issues:

1. Check the build output: `pnpm run build`
2. Check for TypeScript errors: `pnpm run check`
3. Test the server manually: `node dist/index.js`
4. Review Claude Desktop logs
5. Verify the config file path is correct

Good luck! 🎉
