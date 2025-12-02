/**
 * Alerts tool - Handler
 * Gets weather alerts for a US state using NWS API
 */

import { config } from "../../../utils/config.js";
import { fetchFromNWS } from "../../../utils/fetch.js";
import type { AlertsInput } from "./input_schema.js";
import type { AlertsOutput, NWSAlertsResponse } from "./output_schema.js";

/**
 * Get weather alerts for a US state
 */
export async function handleGetAlerts(input: AlertsInput): Promise<AlertsOutput> {
  const stateCode = input.state.toUpperCase();

  // Validate state code
  if (!/^[A-Z]{2}$/.test(stateCode)) {
    throw new Error(
      "Invalid state code. Please provide a two-letter US state code (e.g., 'CA', 'NY', 'TX')"
    );
  }

  // Fetch alerts
  const data = await fetchFromNWS<NWSAlertsResponse>(
    `${config.nws.baseUrl}/alerts?area=${stateCode}`
  );
  const features = data.features || [];

  if (features.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No active weather alerts for ${stateCode}`,
        },
      ],
    };
  }

  // Format alerts
  const alertsText = features
    .map((feature, index: number) => {
      const props = feature.properties;
      return `
Alert ${index + 1}:
- Event: ${props.event}
- Severity: ${props.severity}
- Urgency: ${props.urgency}
- Areas: ${props.areaDesc}
- Headline: ${props.headline}
- Description: ${props.description}
- Instructions: ${props.instruction || "None provided"}
- Effective: ${props.effective}
- Expires: ${props.expires}
`;
    })
    .join("\n" + "=".repeat(80) + "\n");

  return {
    content: [
      {
        type: "text",
        text: `Weather Alerts for ${stateCode}\n${"=".repeat(80)}\n${alertsText}`,
      },
    ],
  };
}
