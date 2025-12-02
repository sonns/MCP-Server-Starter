/**
 * Alerts Tool
 * Gets weather alerts for a US state using NWS API
 */

export { handleGetAlerts } from "./handler.js";
export { alertsInputSchema } from "./input_schema.js";
export type { AlertsInput } from "./input_schema.js";
export type { AlertsOutput } from "./output_schema.js";

/**
 * Tool metadata
 */
export const alertsToolMetadata = {
  name: "alerts",
  description: "Get weather alerts for a US state",
};
