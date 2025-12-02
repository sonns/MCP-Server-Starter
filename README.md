# MCP Server Starter

A TypeScript-based [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server template with built-in tools for Weather and Garoon integration.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher

### Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build
```

### Configuration

Configure your MCP client (e.g., Claude Desktop) with the server:

**File**: `~/.cursor/mcp.json` or `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-starter": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/PROJECT/dist/index.js"],
      "env": {
        "NWS_BASE_URL": "https://api.weather.gov",
        "GAROON_BASE_URL": "http://localhost:8080/cgi-bin/cbgrn/grn.cgi/",
        "GAROON_USERNAME": "Administrator",
        "GAROON_PASSWORD": "cybozu"
      }
    }
  }
}
```

**Important**: Replace `/ABSOLUTE/PATH/TO/PROJECT/` with your actual project path.

### Usage

After restarting your MCP client, you can use natural language:

```
"What's the weather forecast for San Francisco?"
"Show me my schedule for next week"
"Are there any weather alerts in California?"
```

## 🛠️ Available Tools

### Weather Service

#### `weather_forecast`

Get 7-day weather forecast for any US location.

- **Input**: Latitude and longitude
- **Example**: "What's the weather in San Francisco (37.7749, -122.4194)?"

#### `weather_alerts`

Get active weather alerts for any US state.

- **Input**: Two-letter state code (e.g., "CA", "NY", "TX")
- **Example**: "Are there weather alerts in California?"

### Garoon Service

#### `gr_get-schedule-events`

Get schedule events from Garoon groupware.

- **Input**: Date range (optional), target user/org/facility (optional)
- **Example**: "Show my schedule for next week"

## 📁 Project Structure

```
src/
├── tools/                     # MCP tools
│   ├── weather/              # Weather tools
│   │   ├── forecast/
│   │   └── alerts/
│   └── garoon/               # Garoon tools
│       └── get-schedule-events/
├── utils/                     # Utilities
│   ├── config.ts             # Configuration
│   └── fetch.ts              # API helpers
└── index.ts                  # Server entry point

docs/                          # Documentation
├── SETUP_GUIDE.md            # Detailed setup instructions
└── TEST_EXAMPLES.md          # Testing examples
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm run dev              # Watch mode with auto-rebuild
pnpm run build            # Build for production
pnpm run watch            # Watch for changes

# Code Quality
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix linting issues
pnpm run format           # Format code with Prettier
pnpm run typecheck        # Type check without building
pnpm run check            # Run all checks (type, lint, format)

# Cleanup
pnpm run clean            # Remove build artifacts
```

### Adding a New Tool

1. Create a tool directory in `src/tools/{service}/{tool-name}/`
2. Add required files:
   - `handler.ts` - Business logic
   - `input_schema.ts` - Input validation
   - `output_schema.ts` - Output types
   - `index.ts` - Public API
3. Register the tool in `src/tools/index.ts`
4. Build and test

See [TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md) for detailed guide.

## 📖 Documentation

- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Test Examples](./docs/TEST_EXAMPLES.md)** - Testing and usage examples
- **[Coding Standards](./CODING_STANDARDS.md)** - Code style and best practices
- **[Tool Template](./docs/TOOL_TEMPLATE.md)** - Guide for creating new tools
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines

## 🌍 API Information

### National Weather Service (NWS) API

- **URL**: https://api.weather.gov
- **Coverage**: United States only
- **Authentication**: None required
- **Rate Limits**: None specified

### Garoon API

- **URL**: Configurable via `GAROON_BASE_URL`
- **Authentication**: Username/Password (X-Cybozu-Authorization)
- **Coverage**: Your Garoon instance

## 🔍 Troubleshooting

### Server won't start

1. Check build: `pnpm run build`
2. Verify absolute path in config
3. Check Node.js version: `node --version` (≥18.0.0)

### Tools not appearing

1. Restart MCP client after config changes
2. Check client logs for errors
3. Test manually: `node dist/index.js`

### API errors

- **Weather**: Only US locations supported
- **Garoon**: Check credentials and base URL

For more help, see [Setup Guide](./docs/SETUP_GUIDE.md#troubleshooting).

## 📝 Environment Variables

| Variable          | Default                                        | Description       |
| ----------------- | ---------------------------------------------- | ----------------- |
| `NWS_BASE_URL`    | `https://api.weather.gov`                      | NWS API base URL  |
| `NWS_USER_AGENT`  | `weather-app/1.0`                              | User-Agent header |
| `GAROON_BASE_URL` | `http://localhost:8080/cgi-bin/cbgrn/grn.cgi/` | Garoon API URL    |
| `GAROON_USERNAME` | `Administrator`                                | Garoon username   |
| `GAROON_PASSWORD` | `cybozu`                                       | Garoon password   |

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📜 License

MIT

## 🔗 Resources

- [Model Context Protocol](https://modelcontextprotocol.io)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)

---

Made with ❤️ using MCP and TypeScript
