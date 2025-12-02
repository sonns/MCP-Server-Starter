/**
 * Forecast tool - Input schema
 */

export const forecastInputSchema = {
  type: "object" as const,
  properties: {
    latitude: {
      type: "number" as const,
      description: "Latitude of the location (-90 to 90)",
      minimum: -90,
      maximum: 90,
    },
    longitude: {
      type: "number" as const,
      description: "Longitude of the location (-180 to 180)",
      minimum: -180,
      maximum: 180,
    },
  },
  required: ["latitude", "longitude"],
};

export interface ForecastInput {
  latitude: number;
  longitude: number;
}
