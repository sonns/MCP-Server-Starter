# Coding Standards

This document outlines the coding standards and best practices for the MCP Server Starter project.

> **Note**: This file is the comprehensive human-readable guide. For AI-optimized quick reference, see [`.cursor/rules`](./.cursor/rules).

## Table of Contents

- [TypeScript Standards](#typescript-standards)
- [Code Formatting](#code-formatting)
- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)
- [Documentation](#documentation)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Git Practices](#git-practices)

## TypeScript Standards

### Type Safety

**Always use strict mode:**

```typescript
// tsconfig.json already has strict: true
```

**Prefer explicit types for function returns:**

```typescript
// ✅ Good
function calculateSum(a: number, b: number): number {
  return a + b;
}

// ❌ Bad - implicit return type
function calculateSum(a: number, b: number) {
  return a + b;
}
```

**Avoid `any` type:**

```typescript
// ✅ Good
function processData(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  throw new Error("Invalid data type");
}

// ❌ Bad
function processData(data: any): string {
  return data.toUpperCase();
}
```

**Use type guards for type narrowing:**

```typescript
// ✅ Good
function isString(value: unknown): value is string {
  return typeof value === "string";
}

if (isString(data)) {
  console.error(data.toUpperCase());
}
```

### Interfaces vs Types

**Prefer interfaces for object shapes:**

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions, intersections, or primitives
type Status = "pending" | "active" | "completed";
type ID = string | number;
```

### Async/Await

**Prefer async/await over Promise chains:**

```typescript
// ✅ Good
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data as User;
}

// ❌ Bad
function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then((data) => data as User);
}
```

## Code Formatting

All code formatting is enforced by Prettier. Run `pnpm run format` before committing.

### Key Formatting Rules

- **Indentation**: 2 spaces
- **Line length**: 100 characters maximum
- **Quotes**: Double quotes
- **Semicolons**: Required
- **Trailing commas**: ES5 style

### Import Organization

```typescript
// 1. External dependencies
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 2. Internal modules (alphabetically)
import { calculateSum } from "./utils/math.js";
import { validateInput } from "./utils/validation.js";

// 3. Type imports
import type { ToolResponse, ResourceContent } from "./types/index.js";
```

## Naming Conventions

### Files and Directories

```
✅ kebab-case for files
user-service.ts
weather-tool.ts
api-client.ts

✅ lowercase for directories
src/tools/
src/resources/
src/utils/
```

### TypeScript Code

```typescript
// ✅ PascalCase for classes and interfaces
class UserService {}
interface UserData {}

// ✅ camelCase for functions, methods, variables
function getUserById() {}
const userName = "John";

// ✅ UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";

// ✅ Prefix private members with underscore
class Service {
  private _cache: Map<string, any>;

  private _clearCache(): void {
    this._cache.clear();
  }
}
```

### MCP-Specific Naming

```typescript
// ✅ Tool names: lowercase with underscores
"calculate_sum";
"fetch_weather";
"get_user_data";

// ✅ Resource URIs: scheme://path
"config://settings";
"data://users/123";
"file:///path/to/file";

// ✅ Prompt names: lowercase with underscores
"greeting";
"code_review";
"explain_concept";
```

## File Organization

### Project Structure

```
src/
├── index.ts              # Main entry point - server setup
├── tools/                # Tool implementations
│   ├── {service}/       # Service directory (e.g., weather, garoon)
│   │   ├── {tool-name}/ # Individual tool directory
│   │   │   ├── handler.ts         # Business logic
│   │   │   ├── input_schema.ts    # Input validation
│   │   │   ├── output_schema.ts   # Output types
│   │   │   └── index.ts           # Public exports
│   │   └── README.md    # Service documentation
│   └── index.ts         # Tool registration
├── resources/            # Resource implementations
│   ├── index.ts
│   └── config.ts
├── prompts/              # Prompt implementations
│   ├── index.ts
│   └── greeting.ts
├── utils/                # Utility functions
│   ├── config.ts        # Configuration management
│   ├── fetch.ts         # API fetch helpers
│   ├── validation.ts    # Validation utilities
│   └── formatting.ts    # Formatting utilities
└── constants.ts          # Application constants

docs/
├── SETUP_GUIDE.md        # Setup instructions
├── TEST_EXAMPLES.md      # Testing examples
└── TOOL_TEMPLATE.md      # Tool creation guide
```

### Module Organization

**Tool Directory Structure:**

Each tool should be in its own directory with 4 required files:

```
tools/{service}/{tool-name}/
├── handler.ts          # Core business logic
├── input_schema.ts     # Input validation and types
├── output_schema.ts    # Output types
└── index.ts            # Public exports
```

**Example: Translation Tool**

```typescript
// tools/ai/translate/handler.ts
export async function handleTranslate(input: TranslateInput): Promise<TranslateOutput> {
  // Implementation
}

// tools/ai/translate/input_schema.ts
export const translateInputSchema = {
  /* schema */
};
export interface TranslateInput {
  /* types */
}

// tools/ai/translate/output_schema.ts
export interface TranslateOutput {
  /* types */
}

// tools/ai/translate/index.ts
export { handleTranslate } from "./handler.js";
export { translateInputSchema } from "./input_schema.js";
export type { TranslateInput } from "./input_schema.js";
export type { TranslateOutput } from "./output_schema.js";
```

**Use main index.ts for tool registration:**

```typescript
// tools/index.ts
import { handleTranslate, translateInputSchema } from "./ai/translate/index.js";
import { getToolName } from "../utils/config.js";

// Register tool
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: getToolName("ai", "translate"),
      description: "Translate text between languages",
      inputSchema: translateInputSchema,
    },
  ],
}));
```

## Documentation

### JSDoc Comments

**All public APIs must have JSDoc comments:**

````typescript
/**
 * Calculates the sum of two numbers.
 *
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 *
 * @example
 * ```typescript
 * const result = add(5, 3); // Returns 8
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
````

**Document complex logic with inline comments:**

```typescript
function processComplexData(data: unknown): Result {
  // First, validate the input structure
  if (!isValidData(data)) {
    throw new Error("Invalid data structure");
  }

  // Transform data to normalized format
  // Note: This handles both old and new API formats
  const normalized = normalizeData(data);

  // Apply business logic
  return computeResult(normalized);
}
```

### README Updates

When adding new features, update the README.md:

- Add new tool descriptions
- Update usage examples
- Document new configuration options
- Add troubleshooting sections if needed

## Error Handling

### Always Handle Errors

```typescript
// ✅ Good - proper error handling
async function fetchData(url: string): Promise<Data> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as Data;
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    throw new Error(
      `Data fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ❌ Bad - unhandled error
async function fetchData(url: string): Promise<Data> {
  const response = await fetch(url);
  return (await response.json()) as Data;
}
```

### MCP Tool Error Responses

```typescript
// ✅ Good - return error response
case "my_tool": {
  try {
    const result = await processRequest(args);
    return {
      content: [{ type: "text", text: result }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      }],
      isError: true
    };
  }
}
```

### Error Messages

```typescript
// ✅ Good - descriptive error messages
throw new Error(`User not found with ID: ${userId}`);
throw new Error(`Invalid operation: ${operation}. Expected: add, subtract, multiply, or divide`);

// ❌ Bad - vague error messages
throw new Error("Error");
throw new Error("Invalid input");
```

## Testing

### Test Structure

```typescript
// tests/calculator.test.ts
import { describe, it, expect } from "vitest";
import { calculate } from "../src/tools/calculator.js";

describe("Calculator", () => {
  describe("add operation", () => {
    it("should add two positive numbers", () => {
      const result = calculate({ operation: "add", a: 5, b: 3 });
      expect(result).toBe(8);
    });

    it("should handle negative numbers", () => {
      const result = calculate({ operation: "add", a: -5, b: 3 });
      expect(result).toBe(-2);
    });
  });

  describe("divide operation", () => {
    it("should throw error on division by zero", () => {
      expect(() => {
        calculate({ operation: "divide", a: 10, b: 0 });
      }).toThrow("Division by zero");
    });
  });
});
```

### Test Coverage

- Write tests for all public functions
- Test both success and failure cases
- Test edge cases and boundary conditions
- Mock external dependencies

## Git Practices

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance

**Examples:**

```
feat(tools): add weather lookup tool

Implement new tool to fetch current weather data using OpenWeather API.
Includes temperature, humidity, and conditions.

Closes #42

---

fix(resources): handle undefined resource URIs

Previously would crash when accessing undefined resource.
Now returns proper error message.

---

docs(readme): add troubleshooting section

Add common issues and solutions for MacOS and Windows users
```

### Branch Naming

```
feature/tool-weather-lookup
fix/resource-uri-handling
docs/update-contributing-guide
refactor/split-tool-handlers
```

### Pull Request Guidelines

1. Keep PRs focused and small
2. Write clear descriptions
3. Link related issues
4. Ensure all checks pass
5. Request reviews when needed

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows TypeScript standards
- [ ] All functions have proper type annotations
- [ ] No `any` types used
- [ ] Error handling is comprehensive
- [ ] Code is properly documented
- [ ] Tests are written and passing
- [ ] `pnpm run check` passes
- [ ] No console.log() statements
- [ ] Commit messages follow conventions
- [ ] README updated if needed

## Performance Guidelines

### Avoid Blocking Operations

```typescript
// ✅ Good - non-blocking
async function processItems(items: Item[]): Promise<Result[]> {
  return Promise.all(items.map((item) => processItem(item)));
}

// ❌ Bad - blocking
async function processItems(items: Item[]): Promise<Result[]> {
  const results: Result[] = [];
  for (const item of items) {
    results.push(await processItem(item));
  }
  return results;
}
```

### Cache When Appropriate

```typescript
// ✅ Good - caching static data
class ConfigService {
  private _cache: Map<string, Config> = new Map();

  async getConfig(key: string): Promise<Config> {
    if (this._cache.has(key)) {
      return this._cache.get(key)!;
    }

    const config = await this._loadConfig(key);
    this._cache.set(key, config);
    return config;
  }
}
```

## Security Guidelines

1. **Validate All Inputs**

   ```typescript
   function processInput(input: unknown): ProcessedData {
     if (!isValidInput(input)) {
       throw new Error("Invalid input");
     }
     return transformInput(input);
   }
   ```

2. **Sanitize User Data**

   ```typescript
   function sanitizeString(input: string): string {
     return input.replace(/[<>]/g, "");
   }
   ```

3. **Use Environment Variables for Secrets**

   ```typescript
   const apiKey = process.env.API_KEY;
   if (!apiKey) {
     throw new Error("API_KEY environment variable is required");
   }
   ```

4. **Never Execute Arbitrary Code**
   ```typescript
   // ❌ Never do this
   eval(userInput);
   new Function(userInput)();
   ```

---

## Creating New Tools

For detailed instructions on creating new tools, see [docs/TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md).

### Quick Checklist

When creating a new tool:

- [ ] Create directory: `src/tools/{service}/{tool-name}/`
- [ ] Implement 4 required files: `handler.ts`, `input_schema.ts`, `output_schema.ts`, `index.ts`
- [ ] Add comprehensive JSDoc comments
- [ ] Validate all inputs properly
- [ ] Handle errors gracefully
- [ ] Register in `src/tools/index.ts`
- [ ] Add tests
- [ ] Update `docs/TEST_EXAMPLES.md`
- [ ] Build and test: `pnpm run build && pnpm run check`

### Tool Naming Convention

```typescript
// Service prefix + tool name
getToolName("weather", "forecast"); // → weather_forecast
getToolName("garoon", "get-events"); // → gr_get-events
getToolName("ai", "translate"); // → ai_translate

// Special prefixes:
// - weather: weather_
// - garoon: gr_
// - others: {service}_
```

### Input Schema Best Practices

```typescript
// ✅ Good - clear descriptions, proper types
export const myToolInputSchema = {
  type: "object" as const,
  properties: {
    requiredField: {
      type: "string" as const,
      description: "Clear description of what this field does and any constraints",
    },
    optionalField: {
      type: "number" as const,
      minimum: 1,
      maximum: 100,
      description: "Optional field with range constraints. Default: 10",
    },
  },
  required: ["requiredField"],
};

// Add validation rules as comments
/**
 * My Tool Input Schema
 *
 * Rules:
 * - If fieldA is provided, fieldB becomes required
 * - Date fields must be in RFC 3339 format
 * - Numeric fields are validated at runtime
 */
```

### Handler Best Practices

```typescript
// ✅ Good - comprehensive handler
export async function handleMyTool(input: MyToolInput): Promise<MyToolOutput> {
  // 1. Validate input dependencies
  if (input.fieldA && !input.fieldB) {
    throw new Error("fieldB is required when fieldA is provided");
  }

  // 2. Build API request
  const endpoint = buildEndpoint(input);

  try {
    // 3. Call external API
    const data = await fetchApi<ApiResponse>(endpoint);

    // 4. Format output
    const result = formatOutput(data);

    // 5. Return success response
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    // 6. Handle errors gracefully
    console.error("Tool failed:", error);
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

// Helper function for formatting
function formatOutput(data: ApiResponse): string {
  const lines: string[] = [];
  lines.push(`Title: ${data.title}`);
  if (data.description) {
    lines.push(`Description: ${data.description}`);
  }
  return lines.join("\n");
}
```

---

## Questions?

If you have questions about these standards:

1. Check existing code for examples (see `src/tools/weather/` and `src/tools/garoon/`)
2. Review [docs/TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md)
3. Review the TypeScript documentation
4. Ask in team discussions
5. Open an issue for clarification

Remember: These standards exist to make the codebase maintainable, readable, and reliable. Follow them consistently.
