// Calendar dates as "YYYY-MM-DD" in the device's local time zone.
//
// Avoid `date.toISOString().split("T")[0]` for this: toISOString is UTC, so
// in India (UTC+5:30) midnight–5:30am reads as yesterday, and local midnight
// on the 1st becomes the last day of the previous month.

const pad = (value: number) => String(value).padStart(2, "0");

export function toLocalDateKey(date: Date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Inverse of toLocalDateKey. `new Date("2026-10-14")` parses as UTC
// midnight, which is the previous day west of UTC; this is local midnight.
export function parseLocalDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}
