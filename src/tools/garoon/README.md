# Garoon Tools

This directory contains tools for Garoon groupware integration.

## Structure

Each tool should follow this structure:

```
garoon/
└── tool-name/
    ├── handler.ts         # Business logic
    ├── input_schema.ts    # Input validation
    ├── output_schema.ts   # Output types
    └── index.ts           # Public API
```

## Example Tool Structure

### 1. `input_schema.ts`

```typescript
export const toolNameInputSchema = {
  type: "object" as const,
  properties: {
    param1: {
      type: "string" as const,
      description: "Description",
    },
  },
  required: ["param1"],
};

export interface ToolNameInput {
  param1: string;
}
```

### 2. `output_schema.ts`

```typescript
export interface GaroonApiResponse {
  // Define API response structure
}

export interface ToolNameOutput {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
```

### 3. `handler.ts`

```typescript
import { config } from "../../../utils/config.js";
import { fetchFromGarron } from "../../../utils/fetch.js";
import type { ToolNameInput } from "./input_schema.js";
import type { ToolNameOutput, GaroonApiResponse } from "./output_schema.js";

export async function handleToolName(
  input: ToolNameInput
): Promise<ToolNameOutput> {
  const url = `${config.garron.baseUrl}/api/endpoint`;
  const data = await fetchFromGarron<GaroonApiResponse>(url);

  return {
    content: [
      {
        type: "text",
        text: "Result",
      },
    ],
  };
}
```

### 4. `index.ts`

```typescript
export { handleToolName } from "./handler.js";
export { toolNameInputSchema } from "./input_schema.js";
export type { ToolNameInput } from "./input_schema.js";
export type { ToolNameOutput } from "./output_schema.js";

export const toolNameMetadata = {
  name: "tool-name",  // Will become "garoon_tool-name"
  description: "What the tool does",
};
```

## Registering a New Tool

1. Create the tool folder and files (above)
2. Add to `src/tools/index.ts`:

```typescript
import {
  toolNameMetadata,
  toolNameInputSchema,
  handleToolName,
} from "./garoon/tool-name/index.js";

const tools: ToolDefinition[] = [
  // ... existing tools
  {
    name: getToolName("garoon", toolNameMetadata.name),
    description: toolNameMetadata.description,
    inputSchema: toolNameInputSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    handler: async (input: unknown) => await handleToolName(input as any),
  },
];
```

3. Build and test:

```bash
pnpm run build
pnpm run check
```

## Tool Naming

- Folder name: `tool-name` (kebab-case)
- Metadata name: `"tool-name"` (matches folder)
- Final tool name: `"garoon_tool-name"`
- With prefix: `"myapp_garoon_tool-name"`

## Available APIs

The `fetchFromGarron` helper in `src/utils/fetch.ts` provides:
- Basic Auth (username/password from config)
- Proper headers
- Error handling

Example usage:

```typescript
const data = await fetchFromGarron<YourType>(`${config.garron.baseUrl}/api/v1/endpoint`);
```

## Configuration

Garoon API credentials are configured in the MCP client config:

```json
{
  "env": {
    "GAROON_BASE_URL": "https://grn-main.cybozu-dev.com/g",
    "GAROON_USERNAME": "your-username",
    "GAROON_PASSWORD": "your-password"
  }
}
```

## Next Steps

When you're ready to add Garron tools, provide:
1. API endpoints
2. Request/response formats
3. Tool specifications (name, purpose, inputs, outputs)
