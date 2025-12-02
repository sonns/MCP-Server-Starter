/**
 * Get Schedule Events Tool
 * Gets schedule events from Garoon groupware system
 */

export { handleGetScheduleEvents } from "./handler.js";
export { getScheduleEventsInputSchema } from "./input_schema.js";
export type { GetScheduleEventsInput } from "./input_schema.js";
export type { GetScheduleEventsOutput } from "./output_schema.js";

/**
 * Tool metadata
 */
export const getScheduleEventsMetadata = {
  name: "get-schedule-events",
  description:
    "Get schedule events from Garoon for a specific target (user, organization, or facility) within a date range",
};
