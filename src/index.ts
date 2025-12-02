#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPrompts } from "./prompts/index.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

/**
 * MCP Server Starter
 *
 * A Model Context Protocol (MCP) server that provides weather information
 * and groupware integration.
 *
 * Tools are organized by service:
 * - weather/* - Weather tools using NWS API
 * - garoon/* - Garoon groupware tools
 */

// Create server instance
const server = new Server(
  {
    name: "mcp-server-starter",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// Register all capabilities
registerTools(server);
registerResources(server);
registerPrompts(server);

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr since stdout is used for MCP communication
  console.error("MCP Server Starter running on stdio");
  console.error("Server: mcp-server-starter v1.0.0");
  console.error("Tools registered successfully");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
