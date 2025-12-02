/**
 * Forecast Tool
 * Gets weather forecast for a location using NWS API
 */

export { handleGetForecast } from "./handler.js";
export { forecastInputSchema } from "./input_schema.js";
export type { ForecastInput } from "./input_schema.js";
export type { ForecastOutput } from "./output_schema.js";

/**
 * Tool metadata
 */
export const forecastToolMetadata = {
  name: "forecast",
  description: "Get weather forecast for a location (US only)",
};
