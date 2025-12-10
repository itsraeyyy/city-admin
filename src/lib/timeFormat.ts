/**
 * Time formatting utilities for 12-hour format with Amharic labels
 */

/**
 * Convert 24-hour time string (HH:MM) to 12-hour format with Amharic labels
 * @param time24 - Time in 24-hour format (HH:MM) or undefined
 * @returns Formatted time string like "2:30 ከሰአት" or "10:15 ጥዋት"
 */
export function formatTime12Hour(time24: string | undefined | null): string {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":").map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time24;

  const period = hours >= 12 ? "ከሰአት" : "ጥዋት";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Convert 12-hour time string with Amharic labels to 24-hour format
 * @param time12 - Time in 12-hour format like "2:30 ከሰአት" or "10:15 ጥዋት"
 * @returns Time in 24-hour format (HH:MM) or original string if invalid
 */
export function parseTime12Hour(time12: string): string {
  if (!time12) return "";

  // Try to parse formats like "2:30 ከሰአት" or "10:15 ጥዋት"
  const match = time12.match(/(\d{1,2}):(\d{2})\s*(ጥዋት|ከሰአት)/);
  
  if (!match) {
    // If it's already in 24-hour format, return as is
    if (time12.match(/^\d{2}:\d{2}$/)) {
      return time12;
    }
    return "";
  }

  const [, hoursStr, minutesStr, period] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (period === "ከሰአት") {
    // PM: add 12, except for 12 PM which stays 12
    hours = hours === 12 ? 12 : hours + 12;
  } else {
    // AM: 12 AM becomes 0, others stay the same
    hours = hours === 12 ? 0 : hours;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Convert 24-hour time to 12-hour format for input value
 * Used for populating time inputs
 */
export function time24To12ForInput(time24: string | undefined | null): string {
  if (!time24) return "";
  
  const [hours, minutes] = time24.split(":").map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return "";

  const period = hours >= 12 ? "ከሰአት" : "ጥዋት";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

