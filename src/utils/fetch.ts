/**
 * HTTP fetch utilities for different APIs
 */

import { config } from "./config.js";

/**
 * Fetch data from NWS API (National Weather Service)
 */
export async function fetchFromNWS<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": config.nws.userAgent,
      Accept: "application/geo+json",
    },
  });

  if (!response.ok) {
    throw new Error(`NWS API error: HTTP ${response.status} - ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch data from Garron API
 * Uses Cybozu Authentication with X-Cybozu-Authorization header
 */
export async function fetchFromGarron<T>(
  endpoint: string,
  options?: { method?: string; body?: string }
): Promise<T> {
  if (!config.garron.baseUrl) {
    throw new Error("Garron API is not configured. Please set GAROON_BASE_URL in MCP config.");
  }

  const url = `${config.garron.baseUrl}${endpoint}`;
  const API_CREDENTIAL = Buffer.from(
    `${config.garron.username}:${config.garron.password}`
  ).toString("base64");

  const response = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Cybozu-Authorization": API_CREDENTIAL,
    },
    body: options?.body,
  });

  if (!response.ok) {
    console.error(url);
    throw new Error(`Garron API error: HTTP ${response.status} - ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
