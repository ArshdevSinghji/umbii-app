import { getCalendars } from "expo-localization";

// The phone's IANA zone (e.g. "Asia/Kolkata"), read fresh each call so a
// trip shows up on the next request. Intl first; expo-localization where
// Intl has none. Undefined if neither knows: the server rejects made-up
// values, so callers leave the zone out rather than guess.
export function getTimezone(): string | undefined {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone) return zone;
  } catch {
    // Fall through to expo-localization.
  }
  return getCalendars()[0]?.timeZone ?? undefined;
}
