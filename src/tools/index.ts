/**
 * Tools registry
 * Central registry for all tools organized by service/API
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { getToolName } from "../utils/config.js";

// Weather tools
import {
  forecastInputSchema,
  forecastToolMetadata,
  handleGetForecast,
} from "./weather/forecast/index.js";

import { alertsInputSchema, alertsToolMetadata, handleGetAlerts } from "./weather/alerts/index.js";

// Garoon tools
import {
  getScheduleEventsInputSchema,
  getScheduleEventsMetadata,
  handleGetScheduleEvents,
} from "./garoon/get-schedule-events/index.js";

/**
 * Tool definition interface
 */
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (input: unknown) => Promise<{
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  }>;
}

/**
 * All available tools
 */
const tools: ToolDefinition[] = [
  // Weather: Forecast
  {
    name: getToolName("weather", forecastToolMetadata.name),
    description: forecastToolMetadata.description,
    inputSchema: forecastInputSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    handler: async (input: unknown) => await handleGetForecast(input as any),
  },

  // Weather: Alerts
  {
    name: getToolName("weather", alertsToolMetadata.name),
    description: alertsToolMetadata.description,
    inputSchema: alertsInputSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    handler: async (input: unknown) => await handleGetAlerts(input as any),
  },

  // Garoon: Get Schedule Events
  {
    name: getToolName("garoon", getScheduleEventsMetadata.name),
    description: getScheduleEventsMetadata.description,
    inputSchema: getScheduleEventsInputSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    handler: async (input: unknown) => await handleGetScheduleEvents(input as any),
  },
];

/**
 * Register all tools with the MCP server
 */
export function registerTools(server: Server): void {
  // List tools
  // eslint-disable-next-line @typescript-eslint/require-await
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Call tool
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    const tool = tools.find((t) => t.name === name);

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      return await tool.handler(args);
    } catch (error) {
      console.error(`Error in ${name} tool:`, error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
          },
        ],
        isError: true,
      };
    }
  });
}
