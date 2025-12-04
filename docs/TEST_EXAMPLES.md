# MCP Server - Test Examples

This document contains test examples for all available tools in the MCP Weather Server.

## Setup

1. Build the project:
```bash
pnpm run build
```

2. Configure MCP client (Claude Desktop, etc.) with `mcp.json` or copy config:
```bash
cp mcp.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

3. Restart your MCP client

## Available Tools

### 1. Weather Service

#### Tool: `weather_forecast`

Get weather forecast for a US location using latitude and longitude.

**Example 1: San Francisco Weather**
```json
{
  "tool": "weather_forecast",
  "arguments": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

**Example 2: New York Weather**
```json
{
  "tool": "weather_forecast",
  "arguments": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Example 3: Miami Weather**
```json
{
  "tool": "weather_forecast",
  "arguments": {
    "latitude": 25.7617,
    "longitude": -80.1918
  }
}
```

**Natural Language Prompts:**
- "What's the weather forecast for San Francisco?" (37.7749, -122.4194)
- "Give me the weather forecast for New York City"
- "What will the weather be like in Miami this week?"

---

#### Tool: `weather_alerts`

Get active weather alerts for a US state.

**Example 1: California Alerts**
```json
{
  "tool": "weather_alerts",
  "arguments": {
    "state": "CA"
  }
}
```

**Example 2: Florida Alerts**
```json
{
  "tool": "weather_alerts",
  "arguments": {
    "state": "FL"
  }
}
```

**Example 3: Texas Alerts**
```json
{
  "tool": "weather_alerts",
  "arguments": {
    "state": "TX"
  }
}
```

**Natural Language Prompts:**
- "Are there any weather alerts for California?"
- "Show me weather warnings in Texas"
- "What weather alerts are active in Florida?"

---

### 2. Garoon Service

#### Tool: `gr_get-schedule-events`

Get schedule events from Garoon groupware system.

**Important Rules:**
- If `target` is **NOT** provided: retrieves current user's schedule (ignores `targetType`)
- If `target` **IS** provided: must also provide `targetType` (user/organization/facility)
- `targetType` without `target` will cause an error

**Example 1: Get Current User's Events (Recommended)**
```json
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "rangeStart": "2024-01-01T00:00:00+09:00",
    "rangeEnd": "2024-01-07T23:59:59+09:00"
  }
}
```

**Example 2: Get Specific User's Events**
```json
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "target": "12345",
    "targetType": "user",
    "rangeStart": "2024-01-01T00:00:00+09:00",
    "rangeEnd": "2024-01-07T23:59:59+09:00"
  }
}
```

**Example 3: Get Organization Events**
```json
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "target": "100",
    "targetType": "organization",
    "rangeStart": "2024-01-01T00:00:00+09:00",
    "rangeEnd": "2024-01-31T23:59:59+09:00"
  }
}
```

**Example 4: Get Facility Schedule**
```json
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "target": "5",
    "targetType": "facility",
    "rangeStart": "2024-01-15T00:00:00+09:00",
    "rangeEnd": "2024-01-15T23:59:59+09:00"
  }
}
```

**Example 5: Pagination (First 20 Results)**
```json
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "rangeStart": "2024-01-01T00:00:00+09:00",
    "rangeEnd": "2024-01-31T23:59:59+09:00",
    "limit": 20,
    "offset": 0
  }
}
```

**Example 6: Pagination (Next 20 Results)**
```json
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "rangeStart": "2024-01-01T00:00:00+09:00",
    "rangeEnd": "2024-01-31T23:59:59+09:00",
    "limit": 20,
    "offset": 20
  }
}
```

**❌ Invalid Examples (Will Cause Errors):**

```json
// ❌ Bad: targetType without target
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "targetType": "user",
    "rangeStart": "2024-01-01T00:00:00+09:00"
  }
}

// ❌ Bad: target without targetType
{
  "tool": "gr_get-schedule-events",
  "arguments": {
    "target": "12345",
    "rangeStart": "2024-01-01T00:00:00+09:00"
  }
}
```

**Natural Language Prompts:**
- "Show me my schedule for next week" (uses current user)
- "What events do I have today?" (uses current user)
- "Show me user 12345's schedule for next week" (specify target user)
- "Get the meeting room schedule for facility ID 5" (specify target facility)
- "Show me organization 100's events this month" (specify target org)

---

## Testing Tips

### 1. Test Weather Tools

**Valid US State Codes:**
- CA (California)
- NY (New York)
- TX (Texas)
- FL (Florida)
- IL (Illinois)
- WA (Washington)
- AZ (Arizona)

**Common US City Coordinates:**
| City | Latitude | Longitude |
|------|----------|-----------|
| San Francisco, CA | 37.7749 | -122.4194 |
| New York, NY | 40.7128 | -74.0060 |
| Chicago, IL | 41.8781 | -87.6298 |
| Houston, TX | 29.7604 | -95.3698 |
| Phoenix, AZ | 33.4484 | -112.0740 |
| Los Angeles, CA | 34.0522 | -118.2437 |
| Miami, FL | 25.7617 | -80.1918 |
| Seattle, WA | 47.6062 | -122.3321 |

### 2. Test Garoon Tools

**Date Format:** RFC 3339
- Format: `YYYY-MM-DDTHH:mm:ss±HH:mm`
- Example: `2024-01-15T09:00:00+09:00`
- Timezone: Use `+09:00` for JST (Japan Standard Time)

**Target Types:**
- `user` - Individual user schedules
- `organization` - Organization/department schedules
- `facility` - Meeting rooms, equipment schedules

**Common Date Ranges:**
- Today: Same day start/end
- This Week: Monday 00:00 to Sunday 23:59
- This Month: 1st 00:00 to last day 23:59
- Next 7 Days: Now to +7 days

### 3. Testing Workflow

**Step 1: Test Weather Tools**
```
1. Get forecast for San Francisco
2. Check for alerts in California
3. Try different cities and states
```

**Step 2: Test Garoon Tool**
```
1. Get all events (no params)
2. Get events for specific date range
3. Test different target types
4. Test pagination
5. Test public/private filtering
```

**Step 3: Test Error Handling**
```
1. Invalid coordinates (outside range)
2. Invalid state code
3. Invalid date format
4. Invalid target type
```

---

## Expected Responses

### Weather Forecast
```
Weather Forecast for 37.7749, -122.4194
Location: San Francisco, California
================================================================================

Tonight:
- Temperature: 52°F
- Wind: 5 mph SW
- Forecast: Partly Cloudy
- Detailed: Partly cloudy, with a low around 52...
```

### Weather Alerts
```
Weather Alerts for CA
================================================================================

Alert 1:
- Event: Wind Advisory
- Severity: Moderate
- Urgency: Expected
- Areas: San Francisco Bay Area
- Headline: Wind Advisory until 6 PM PST
- Description: Gusty winds expected...
```

### Garoon Schedule Events
```
Schedule Events
Target: user 12345
Period: 2024-01-01T00:00:00+09:00 to 2024-01-07T23:59:59+09:00
Found: 5 events
All results retrieved
================================================================================

Event 1: Weekly Team Meeting
  ID: 123
  Start: 2024-01-02T10:00:00+09:00
  End: 2024-01-02T11:00:00+09:00
  Type: Regular Meeting
  Attendees: John Doe, Jane Smith
  Facilities: Conference Room A
  Visibility: Public
```

---

## Troubleshooting

### Weather Tools Not Working
- Check if coordinates are within US
- Verify state code is valid 2-letter code
- Ensure NWS API is accessible

### Garoon Tool Not Working
- Check Garoon API credentials in mcp.json or MCP config
- Verify base URL is correct (default: `http://localhost:8080/cgi-bin/cbgrn/grn.cgi/`)
- Ensure date format is RFC 3339 (e.g., `2024-01-01T00:00:00+09:00` or `2024-01-01T00:00:00Z`)
- If using `target`, make sure to also provide `targetType`
- If using `targetType`, make sure to also provide `target`
- Check if target ID exists in your Garoon system

### General Issues
- Rebuild: `pnpm run build`
- Check logs: Look at MCP client logs
- Restart MCP client after config changes

---

## Quick Test Commands

### Via Claude Desktop or MCP Client

**Test 1: Weather Forecast**
```
"What's the weather forecast for San Francisco at coordinates 37.7749, -122.4194?"
```

**Test 2: Weather Alerts**
```
"Are there any weather alerts for California (state code CA)?"
```

**Test 3: Schedule Events (No Params)**
```
"Get schedule events from Garoon"
```

**Test 4: Schedule Events (Specific Date)**
```
"Get my schedule events for user 12345 from January 1st to January 7th, 2025"
```

**Test 5: Organization Schedule**
```
"Get public events for organization 100 in January 2024"
```

---

## Notes

- All weather tools require US locations only (NWS API limitation)
- Garoon tools require valid credentials in mcp.json
- Date/time should be in RFC 3339 format with timezone
- Pagination is automatic with `hasNext` indicator
- Tool names can have prefix if `TOOL_PREFIX` is set in config

**Happy Testing! 🚀**
