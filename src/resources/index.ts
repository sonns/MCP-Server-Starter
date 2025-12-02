/**
 * Resources registry
 * Register all MCP resources
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  type ReadResourceRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "../utils/config.js";

/**
 * Register all resources with the MCP server
 */
export function registerResources(server: Server): void {
  // List available resources
  // eslint-disable-next-line @typescript-eslint/require-await
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "config://settings",
          name: "Server Settings",
          description: "Current server configuration",
          mimeType: "application/json",
        },
        {
          uri: "info://about",
          name: "About",
          description: "Information about this MCP server",
          mimeType: "text/plain",
        },
      ],
    };
  });

  // Read specific resource
  // eslint-disable-next-line @typescript-eslint/require-await
  server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
    const { uri } = request.params;

    switch (uri) {
      case "config://settings":
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(config, null, 2),
            },
          ],
        };
      case "info://about":
        return {
          contents: [
            {
              uri,
              mimeType: "text/plain",
              text: `MCP Weather Server v1.0.0\nProvides weather forecasts and alerts.`,
            },
          ],
        };
      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  });
}
