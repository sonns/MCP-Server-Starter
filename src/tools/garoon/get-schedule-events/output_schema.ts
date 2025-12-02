/**
 * Get Schedule Events tool - Output schema and types
 */

/**
 * Attendee schema
 */
export interface Attendee {
  id: string;
  type: string;
  name?: string;
  code?: string;
}

/**
 * Facility schema
 */
export interface Facility {
  id: string;
  name: string;
  code?: string;
}

/**
 * Watcher schema
 */
export interface Watcher {
  id: string;
  type: string;
  name?: string;
  code?: string;
}

/**
 * Schedule event object from Garoon API
 */
export interface ScheduleEvent {
  id: string;
  eventType?: string;
  eventMenu?: string;
  subject: string;
  notes?: string;
  visibilityType?: string;
  isStartOnly?: boolean;
  isAllDay?: boolean;
  start: {
    dateTime?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    timeZone?: string;
  };
  attendees?: Attendee[];
  facilities?: Facility[];
  facilityUsingPurpose?: string;
  watchers?: Watcher[];
}

/**
 * Garoon API response for schedule events
 */
export interface GaroonScheduleEventsResponse {
  events: ScheduleEvent[];
  hasNext: boolean;
}

/**
 * Tool output type
 */
export interface GetScheduleEventsOutput {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
