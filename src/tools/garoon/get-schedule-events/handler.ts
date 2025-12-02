/**
 * Get Schedule Events tool - Handler
 * Gets schedule events from Garoon API
 */

import { fetchFromGarron } from "../../../utils/fetch.js";
import type { GetScheduleEventsInput } from "./input_schema.js";
import type {
  GaroonScheduleEventsResponse,
  GetScheduleEventsOutput,
  ScheduleEvent,
} from "./output_schema.js";

/**
 * Format a schedule event for display
 */
function formatEvent(event: ScheduleEvent, index: number): string {
  const lines: string[] = [];

  lines.push(`Event ${index + 1}: ${event.subject}`);
  lines.push(`  ID: ${event.id}`);

  // Date/Time
  if (event.isAllDay) {
    lines.push(`  All Day Event`);
  } else if (event.isStartOnly) {
    lines.push(`  Start: ${event.start.dateTime || "N/A"}`);
  } else {
    lines.push(`  Start: ${event.start.dateTime || "N/A"}`);
    if (event.end) {
      lines.push(`  End: ${event.end.dateTime || "N/A"}`);
    }
  }

  // Event Type & Menu
  if (event.eventType) {
    lines.push(`  Type: ${event.eventType}`);
  }
  if (event.eventMenu) {
    lines.push(`  Menu: ${event.eventMenu}`);
  }

  // Attendees
  if (event.attendees && event.attendees.length > 0) {
    const attendeeNames = event.attendees.map((a) => a.name || a.code || a.id).join(", ");
    lines.push(`  Attendees: ${attendeeNames}`);
  }

  // Facilities
  if (event.facilities && event.facilities.length > 0) {
    const facilityNames = event.facilities.map((f) => f.name || f.code).join(", ");
    lines.push(`  Facilities: ${facilityNames}`);
  }

  // Facility Using Purpose
  if (event.facilityUsingPurpose) {
    lines.push(`  Facility Purpose: ${event.facilityUsingPurpose}`);
  }

  // Watchers
  if (event.watchers && event.watchers.length > 0) {
    const watcherNames = event.watchers.map((w) => w.name || w.code || w.id).join(", ");
    lines.push(`  Watchers: ${watcherNames}`);
  }

  // Notes
  if (event.notes) {
    const shortNotes =
      event.notes.length > 100 ? event.notes.substring(0, 100) + "..." : event.notes;
    lines.push(`  Notes: ${shortNotes}`);
  }

  // Visibility
  if (event.visibilityType) {
    lines.push(`  Visibility: ${event.visibilityType}`);
  }

  return lines.join("\n");
}

/**
 * Get schedule events from Garoon
 */
export async function handleGetScheduleEvents(
  input: GetScheduleEventsInput
): Promise<GetScheduleEventsOutput> {
  // Validate: if targetType is provided without target, return error
  if (input.targetType && !input.target) {
    throw new Error(
      "Invalid parameters: 'targetType' requires 'target' to be specified. " +
        "Either provide both 'target' and 'targetType', or omit both to get current user's schedule."
    );
  }

  // Build query parameters for Garoon API
  const params = new URLSearchParams();

  if (input.target) {
    params.append("target", input.target);
    // targetType is required when target is provided
    if (input.targetType) {
      params.append("targetType", input.targetType);
    } else {
      throw new Error(
        "Invalid parameters: 'target' requires 'targetType' to be specified. " +
          "Please specify targetType as 'user', 'organization', or 'facility'."
      );
    }
  }
  if (input.rangeStart) {
    params.append("rangeStart", input.rangeStart);
  }
  if (input.rangeEnd) {
    params.append("rangeEnd", input.rangeEnd);
  }
  if (input.limit !== undefined) {
    params.append("limit", String(input.limit));
  }
  if (input.offset !== undefined) {
    params.append("offset", String(input.offset));
  }

  // Fetch data using GET with query parameters
  const endpoint = `/api/v1/schedule/events?${params.toString()}`;
  const data = await fetchFromGarron<GaroonScheduleEventsResponse>(endpoint);

  // Handle empty results
  if (!data.events || data.events.length === 0) {
    const targetInfo = input.target
      ? `target ${input.target} (${input.targetType || "user"})`
      : "specified criteria";
    const dateRange =
      input.rangeStart && input.rangeEnd
        ? ` between ${input.rangeStart} and ${input.rangeEnd}`
        : "";
    return {
      content: [
        {
          type: "text",
          text: `No schedule events found for ${targetInfo}${dateRange}`,
        },
      ],
    };
  }

  // Format events
  const eventsText = data.events
    .map((event, index) => formatEvent(event, index))
    .join("\n\n" + "=".repeat(80) + "\n\n");

  // Build summary
  const summaryLines: string[] = [];
  summaryLines.push(`Schedule Events`);
  if (input.target) {
    summaryLines.push(`Target: ${input.targetType || "user"} ${input.target}`);
  }
  if (input.rangeStart && input.rangeEnd) {
    summaryLines.push(`Period: ${input.rangeStart} to ${input.rangeEnd}`);
  }
  summaryLines.push(`Found: ${data.events.length} events`);
  summaryLines.push(
    data.hasNext
      ? `More results available (use offset=${(input.offset || 0) + data.events.length})`
      : "All results retrieved"
  );
  summaryLines.push("=".repeat(80));

  const summary = summaryLines.join("\n");

  return {
    content: [
      {
        type: "text",
        text: `${summary}\n\n${eventsText}`,
      },
    ],
  };
}
