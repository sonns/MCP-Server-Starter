/**
 * Forecast tool - Handler
 * Gets weather forecast for a location using NWS API
 */

import { config } from "../../../utils/config.js";
import { fetchFromNWS } from "../../../utils/fetch.js";
import type { ForecastInput } from "./input_schema.js";
import type { ForecastOutput, NWSForecastResponse, NWSPointsResponse } from "./output_schema.js";

/**
 * Get weather forecast for a location
 */
export async function handleGetForecast(input: ForecastInput): Promise<ForecastOutput> {
  const { latitude, longitude } = input;

  // Validate coordinates
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180"
    );
  }

  // First, get the grid point data
  const pointsData = await fetchFromNWS<NWSPointsResponse>(
    `${config.nws.baseUrl}/points/${latitude},${longitude}`
  );
  const forecastUrl = pointsData.properties.forecast;

  // Get the forecast
  const forecastData = await fetchFromNWS<NWSForecastResponse>(forecastUrl);
  const periods = forecastData.properties.periods || [];

  if (periods.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: "No forecast data available for this location",
        },
      ],
    };
  }

  // Format forecast
  const forecastText = periods
    .slice(0, 7) // Get next 7 periods
    .map((period) => {
      return `
${period.name}:
- Temperature: ${period.temperature}°${period.temperatureUnit}
- Wind: ${period.windSpeed} ${period.windDirection}
- Forecast: ${period.shortForecast}
- Detailed: ${period.detailedForecast}
`;
    })
    .join("\n" + "-".repeat(80) + "\n");

  const location = pointsData.properties.relativeLocation.properties;
  const resultText = `Weather Forecast for ${latitude}, ${longitude}\nLocation: ${location.city}, ${location.state}\n${"=".repeat(80)}\n${forecastText}`;

  return {
    content: [
      {
        type: "text",
        text: resultText,
      },
    ],
  };
}
