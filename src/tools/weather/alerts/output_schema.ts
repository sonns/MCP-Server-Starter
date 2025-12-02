/**
 * Alerts tool - Output schema and types
 */

/**
 * NWS API response types
 */
export interface NWSAlertFeature {
  properties: {
    event: string;
    severity: string;
    urgency: string;
    areaDesc: string;
    headline: string;
    description: string;
    instruction: string | null;
    effective: string;
    expires: string;
  };
}

export interface NWSAlertsResponse {
  features: NWSAlertFeature[];
}

/**
 * Tool output type
 */
export interface AlertsOutput {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
