/**
 * Forecast tool - Output schema and types
 */

export interface NWSForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface NWSForecastResponse {
  properties: {
    periods: NWSForecastPeriod[];
  };
}

export interface NWSPointsResponse {
  properties: {
    forecast: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

export interface ForecastOutput {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
