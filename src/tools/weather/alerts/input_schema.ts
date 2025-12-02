/**
 * Alerts tool - Input schema
 */

export const alertsInputSchema = {
  type: "object" as const,
  properties: {
    state: {
      type: "string" as const,
      description: "Two-letter US state code (e.g., 'CA', 'NY', 'TX')",
      pattern: "^[A-Z]{2}$",
    },
  },
  required: ["state"],
};

/**
 * Type definition for alerts input
 */
export interface AlertsInput {
  state: string;
}
