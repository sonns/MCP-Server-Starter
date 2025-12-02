/**
 * Get Schedule Events tool - Input schema
 *
 * Rules:
 * - If 'target' is NOT provided: retrieves schedule for the current authenticated user (ignores targetType)
 * - If 'target' IS provided: MUST also provide 'targetType' to specify what kind of target it is
 * - rangeStart and rangeEnd are optional but recommended for filtering by date range
 */

export const getScheduleEventsInputSchema = {
  type: "object" as const,
  properties: {
    target: {
      type: "string" as const,
      description:
        "Optional. Target ID as a numeric string (e.g., '12345'). If omitted, retrieves current user's schedule. If provided, 'targetType' becomes REQUIRED.",
    },
    targetType: {
      type: "string" as const,
      enum: ["user", "organization", "facility"],
      description:
        "REQUIRED if 'target' is provided. Type of target: 'user' (person), 'organization' (department/group), or 'facility' (meeting room/resource). Do NOT use without 'target'.",
    },
    rangeStart: {
      type: "string" as const,
      description:
        "Optional. Start datetime in RFC 3339 format (e.g., 2024-01-01T00:00:00+09:00 or 2024-01-01T00:00:00Z). If omitted, defaults to current date.",
    },
    rangeEnd: {
      type: "string" as const,
      description:
        "Optional. End datetime in RFC 3339 format (e.g., 2024-01-07T23:59:59+09:00 or 2024-01-07T23:59:59Z). Must be after rangeStart.",
    },
    limit: {
      type: "number" as const,
      minimum: 1,
      maximum: 1000,
      description:
        "Optional. Maximum number of events to return (1-1000). Default: server default (~100)",
    },
    offset: {
      type: "number" as const,
      minimum: 0,
      description: "Optional. Starting position for pagination (0 or greater). Default: 0",
    },
  },
  required: [],
};

/**
 * Type definition for get-schedule-events input
 *
 * Note: If target is provided, targetType must also be provided
 */
export interface GetScheduleEventsInput {
  /** Target ID (user/org/facility ID). If omitted, uses current user */
  target?: string;
  /** Type of target. REQUIRED if target is provided */
  targetType?: "user" | "organization" | "facility";
  /** Start datetime (RFC 3339 format) */
  rangeStart?: string;
  /** End datetime (RFC 3339 format) */
  rangeEnd?: string;
  /** Maximum number of events (1-1000) */
  limit?: number;
  /** Pagination offset (0+) */
  offset?: number;
}
