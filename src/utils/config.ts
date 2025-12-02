/**
 * Configuration utility
 * Loads environment variables for API configuration
 */

import dotenv from "dotenv";

dotenv.config();

export const config = {
  nws: {
    baseUrl: process.env.NWS_BASE_URL || "https://api.weather.gov",
    userAgent: process.env.NWS_USER_AGENT || "weather-app/1.0",
  },
  garron: {
    baseUrl: process.env.GAROON_BASE_URL || "http://localhost:8080/cgi-bin/cbgrn/grn.cgi/",
    username: process.env.GAROON_USERNAME || "Administrator",
    password: process.env.GAROON_PASSWORD || "cybozu",
  },
};

/**
 * Get tool name with service prefix
 * @param service - Service name (e.g., "weather", "garoon")
 * @param toolName - Tool name (e.g., "forecast", "get-schedule-events")
 * @returns Full tool name with prefix
 *
 * Examples:
 * - getToolName("weather", "forecast") → "weather_forecast"
 * - getToolName("garoon", "get-schedule-events") → "gr_get-schedule-events"
 */
export function getToolName(service: string, toolName: string): string {
  // Garoon tools use "gr_" prefix
  if (service === "garoon") {
    return `gr_${toolName}`;
  }
  // Other services use "service_" format
  return `${service}_${toolName}`;
}
