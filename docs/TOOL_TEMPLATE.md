# Tool Creation Template

This guide helps you create new MCP tools quickly and correctly.

## 📋 Quick Checklist

- [ ] Create tool directory structure
- [ ] Define input schema
- [ ] Define output schema
- [ ] Implement handler logic
- [ ] Create index.ts export
- [ ] Register tool in main index
- [ ] Build and test
- [ ] Update documentation

## 🏗️ Directory Structure

```
src/tools/{service}/{tool-name}/
├── handler.ts          # Business logic
├── input_schema.ts     # Input validation schema
├── output_schema.ts    # Output type definitions
└── index.ts            # Public exports
```

### Example: Creating a "translate" tool under "ai" service

```
src/tools/ai/translate/
├── handler.ts
├── input_schema.ts
├── output_schema.ts
└── index.ts
```

## 📝 Step-by-Step Guide

### Step 1: Create Directory

```bash
mkdir -p src/tools/{service}/{tool-name}
cd src/tools/{service}/{tool-name}
```

### Step 2: Define Input Schema (`input_schema.ts`)

```typescript
/**
 * {Tool Name} tool - Input schema
 *
 * Rules:
 * - List any validation rules here
 * - Explain dependencies between parameters
 * - Document required vs optional fields
 */

export const {toolName}InputSchema = {
  type: "object" as const,
  properties: {
    // Define your input parameters here
    paramName: {
      type: "string" as const,
      description: "Clear description of what this parameter does",
    },
    optionalParam: {
      type: "number" as const,
      minimum: 1,
      maximum: 100,
      description: "Optional parameter with constraints",
    },
  },
  required: [], // List required fields here: ["paramName"]
};

/**
 * Type definition for {tool-name} input
 */
export interface {ToolName}Input {
  /** Description of paramName */
  paramName: string;
  /** Description of optionalParam */
  optionalParam?: number;
}
```

**Example: Translation Tool**

```typescript
export const translateInputSchema = {
  type: "object" as const,
  properties: {
    text: {
      type: "string" as const,
      description: "Text to translate",
    },
    sourceLang: {
      type: "string" as const,
      description: "Source language code (e.g., 'en', 'ja'). If omitted, auto-detect.",
    },
    targetLang: {
      type: "string" as const,
      description: "Target language code (e.g., 'en', 'ja'). Required.",
    },
  },
  required: ["text", "targetLang"],
};

export interface TranslateInput {
  text: string;
  sourceLang?: string;
  targetLang: string;
}
```

### Step 3: Define Output Schema (`output_schema.ts`)

```typescript
/**
 * {Tool Name} tool - Output schema
 */

/**
 * Response from API (if using external API)
 */
export interface {Service}ApiResponse {
  // Define the structure of the API response
  data: string;
  status: string;
}

/**
 * MCP Tool output format
 */
export interface {ToolName}Output {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
```

**Example: Translation Tool**

```typescript
export interface TranslationApiResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  confidence: number;
}

export interface TranslateOutput {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
```

### Step 4: Implement Handler (`handler.ts`)

```typescript
/**
 * {Tool Name} tool - Handler
 * {Brief description of what this tool does}
 */

import { fetch{Service} } from "../../../utils/fetch.js";
import type { {ToolName}Input } from "./input_schema.js";
import type {
  {Service}ApiResponse,
  {ToolName}Output,
} from "./output_schema.js";

/**
 * Main handler function
 */
export async function handle{ToolName}(
  input: {ToolName}Input
): Promise<{ToolName}Output> {
  // 1. Validate input (optional, if complex validation needed)
  if (/* validation condition */) {
    throw new Error("Validation error message");
  }

  // 2. Build API request
  const endpoint = `/api/endpoint`;
  const params = new URLSearchParams();

  if (input.paramName) {
    params.append("paramName", input.paramName);
  }

  // 3. Call external API
  try {
    const data = await fetch{Service}<{Service}ApiResponse>(
      `${endpoint}?${params.toString()}`
    );

    // 4. Process response
    const result = processData(data);

    // 5. Return formatted output
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    // 6. Handle errors
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Helper function to format output
 */
function processData(data: {Service}ApiResponse): string {
  // Format the data for display
  return `Result: ${data.data}`;
}
```

**Example: Translation Tool**

```typescript
import { fetchTranslationApi } from "../../../utils/fetch.js";
import type { TranslateInput } from "./input_schema.js";
import type { TranslationApiResponse, TranslateOutput } from "./output_schema.js";

export async function handleTranslate(
  input: TranslateInput
): Promise<TranslateOutput> {
  // Validate text is not empty
  if (!input.text.trim()) {
    throw new Error("Text to translate cannot be empty");
  }

  // Build API request
  const requestBody = {
    text: input.text,
    target_lang: input.targetLang,
    ...(input.sourceLang && { source_lang: input.sourceLang }),
  };

  try {
    // Call translation API
    const data = await fetchTranslationApi<TranslationApiResponse>(
      "/translate",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    // Format output
    const result = formatTranslation(data);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Translation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
}

function formatTranslation(data: TranslationApiResponse): string {
  let result = `Translation:\n${data.translatedText}`;

  if (data.detectedSourceLanguage) {
    result += `\n\nDetected language: ${data.detectedSourceLanguage}`;
  }

  result += `\nConfidence: ${(data.confidence * 100).toFixed(1)}%`;

  return result;
}
```

### Step 5: Create Index Export (`index.ts`)

```typescript
/**
 * {Tool Name} tool
 */

export { handle{ToolName} } from "./handler.js";
export { {toolName}InputSchema } from "./input_schema.js";
export type { {ToolName}Input } from "./input_schema.js";
export type { {ToolName}Output } from "./output_schema.js";
```

**Example:**

```typescript
export { handleTranslate } from "./handler.js";
export { translateInputSchema } from "./input_schema.js";
export type { TranslateInput } from "./input_schema.js";
export type { TranslateOutput } from "./output_schema.js";
```

### Step 6: Register Tool in Main Index

Edit `src/tools/index.ts`:

```typescript
import {
  handle{ToolName},
  {toolName}InputSchema,
} from "./{service}/{tool-name}/index.js";
import { getToolName } from "../utils/config.js";

// In the tools list:
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ... existing tools ...
    {
      name: getToolName("{service}", "{tool-name}"),
      description: "Brief description of what the tool does",
      inputSchema: {toolName}InputSchema,
    },
  ],
}));

// In the tool handler:
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // ... existing cases ...

    case getToolName("{service}", "{tool-name}"): {
      const input = args as {ToolName}Input;
      return await handle{ToolName}(input);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

**Example for translation tool:**

```typescript
import {
  handleTranslate,
  translateInputSchema,
} from "./ai/translate/index.js";
import { getToolName } from "../utils/config.js";

// In tools list:
{
  name: getToolName("ai", "translate"),
  description: "Translate text between languages",
  inputSchema: translateInputSchema,
},

// In handler:
case getToolName("ai", "translate"): {
  const input = args as TranslateInput;
  return await handleTranslate(input);
}
```

### Step 7: Build and Test

```bash
# Build the project
pnpm run build

# Test the server
node dist/index.js

# Restart your MCP client (e.g., Claude Desktop)
```

### Step 8: Update Documentation

Update `docs/TEST_EXAMPLES.md`:

```markdown
### Tool: `{service}_{tool-name}`

{Description of the tool}

**Example 1: {Use case}**
\`\`\`json
{
  "tool": "{service}_{tool-name}",
  "arguments": {
    "paramName": "value"
  }
}
\`\`\`

**Natural Language Prompts:**
- "Example prompt 1"
- "Example prompt 2"
```

## 🎯 Best Practices

### Input Validation

```typescript
// ✅ Good - validate early
export async function handleMyTool(input: MyInput): Promise<MyOutput> {
  // Validate required fields
  if (!input.requiredField) {
    throw new Error("requiredField is required");
  }

  // Validate dependencies
  if (input.fieldA && !input.fieldB) {
    throw new Error("fieldB is required when fieldA is provided");
  }

  // Continue with logic...
}
```

### Error Handling

```typescript
// ✅ Good - comprehensive error handling
try {
  const data = await fetchApi<ApiResponse>(endpoint);
  return formatSuccess(data);
} catch (error) {
  // Log for debugging
  console.error(`Tool ${toolName} failed:`, error);

  // Return user-friendly error
  return {
    content: [{
      type: "text",
      text: `Failed to process request: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    }],
    isError: true,
  };
}
```

### Output Formatting

```typescript
// ✅ Good - clear, structured output
function formatOutput(data: ApiData): string {
  const lines: string[] = [];

  lines.push(`Result: ${data.title}`);
  lines.push(`Status: ${data.status}`);

  if (data.details) {
    lines.push(`\nDetails:`);
    lines.push(`  ${data.details}`);
  }

  return lines.join("\n");
}
```

### TypeScript Types

```typescript
// ✅ Good - explicit types everywhere
export async function handleMyTool(
  input: MyInput  // Typed input
): Promise<MyOutput> {  // Typed output
  const data: ApiResponse = await fetchApi<ApiResponse>(endpoint);
  const result: string = formatData(data);
  return { content: [{ type: "text", text: result }] };
}
```

## 🔧 Advanced Features

### Optional Parameters with Defaults

```typescript
export const myToolInputSchema = {
  type: "object" as const,
  properties: {
    limit: {
      type: "number" as const,
      minimum: 1,
      maximum: 100,
      description: "Maximum results (1-100). Default: 10",
    },
  },
  required: [],
};

export async function handleMyTool(input: MyInput): Promise<MyOutput> {
  const limit = input.limit ?? 10; // Apply default
  // ...
}
```

### Pagination Support

```typescript
export interface PaginatedOutput {
  content: Array<{ type: "text"; text: string }>;
  hasMore?: boolean;
  nextOffset?: number;
}

export async function handleMyTool(input: MyInput): Promise<PaginatedOutput> {
  const data = await fetchApi(endpoint, { limit: input.limit, offset: input.offset });

  return {
    content: [{ type: "text", text: formatData(data) }],
    hasMore: data.hasNext,
    nextOffset: input.offset + data.items.length,
  };
}
```

### Multiple Output Types

```typescript
export interface MyOutput {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    uri?: string;
  }>;
}
```

## 📚 Complete Example: Weather Radar Tool

See the full implementation in `src/tools/weather/forecast/` for a production-ready example.

## ❓ Common Issues

### Issue: Tool not appearing in MCP client

**Solution**:
1. Make sure you registered it in `src/tools/index.ts`
2. Rebuild: `pnpm run build`
3. Restart MCP client

### Issue: Type errors

**Solution**:
1. Check your imports have `.js` extension
2. Run `pnpm run typecheck`
3. Make sure all types are properly exported

### Issue: Runtime errors

**Solution**:
1. Check console logs
2. Validate input thoroughly
3. Add try-catch blocks around API calls

## 🎓 Learning Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Project Coding Standards](../CODING_STANDARDS.md)

---

**Happy Tool Building! 🛠️**
