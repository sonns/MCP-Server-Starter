# Tools Directory

This directory contains all MCP tools. Each tool is in its own folder.

## Structure

Each tool folder must contain:

- `handler.ts` - Business logic
- `input_schema.ts` - Input validation schema
- `output_schema.ts` - Output type definitions
- `index.ts` - Public API exports

## Tool Naming Convention

**Tool Name = Folder Name**

Example:

- Folder: `Forecast/` → Tool name: `Forecast` (or `weather_Forecast` with prefix)
- Folder: `Alerts/` → Tool name: `Alerts` (or `weather_Alerts` with prefix)

## Current Tools

### Forecast

**Purpose**: Get weather forecast for a location
**Input**: Latitude and longitude
**API**: NWS Points & Forecast API
**Tool Name**: `Forecast` (with TOOL_PREFIX: `weather_Forecast`)

### Alerts

**Purpose**: Get weather alerts for a US state
**Input**: Two-letter state code
**API**: NWS Alerts API
**Tool Name**: `Alerts` (with TOOL_PREFIX: `weather_Alerts`)

## Adding a New Tool

1. Create folder: `mkdir -p YourToolName`
2. Create files: `handler.ts`, `input_schema.ts`, `output_schema.ts`, `index.ts`
3. Implement following the patterns in existing tools
4. Register in `../tools/index.ts`
5. Build and test

## Example: Creating a "Radar" Tool

```bash
mkdir -p Radar
cd Radar
touch handler.ts input_schema.ts output_schema.ts index.ts
```

Then implement each file following the existing patterns.

Register in `src/tools/index.ts`:

```typescript
import {
  radarToolMetadata,
  radarInputSchema,
  handleRadar,
  type RadarInput,
} from "./Radar/index.js";

export const tools: ToolDefinition[] = [
  // ... existing tools
  {
    name: getToolName(radarToolMetadata.name), // "Radar" → "weather_Radar"
    description: radarToolMetadata.description,
    inputSchema: radarInputSchema,
    handler: async (input: unknown) => {
      return handleRadar(input as RadarInput);
    },
  },
];
```

## Tool Metadata

In each tool's `index.ts`:

```typescript
export const yourToolMetadata = {
  name: "YourToolName", // Must match folder name
  description: "What the tool does",
};
```

The final tool name will be:

- Without prefix: `YourToolName`
- With prefix: `${TOOL_PREFIX}YourToolName` (e.g., `weather_YourToolName`)
