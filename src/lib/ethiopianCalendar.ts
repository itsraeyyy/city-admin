/**
 * Ethiopian Calendar Utilities
 * Ethiopian calendar is approximately 7-8 years behind the Gregorian calendar
 */

export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

// Ethiopian month names in Amharic
export const ETHIOPIAN_MONTHS = [
  "መስከረም",
  "ጥቅምት",
  "ሕዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜን"
];

// Days in each Ethiopian month (13 months, last month has 5 or 6 days)
const ETHIOPIAN_MONTH_DAYS = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];

/**
 * Convert Gregorian date to Ethiopian date
 */
export function gregorianToEthiopian(date: Date): EthiopianDate {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  // Ethiopian calendar starts on September 11/12, 7-8 years behind
  const ethiopianYear = gregorianYear - 7;
  
  // Calculate days since September 11
  const startDate = new Date(gregorianYear, 8, 11); // September 11 (month 8 is September)
  const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let ethiopianMonth = 1;
  let ethiopianDay = daysDiff + 1;
  
  // Handle year boundary
  if (ethiopianDay <= 0) {
    ethiopianYear - 1;
    ethiopianDay += 365; // Approximate
  }
  
  // Calculate month and day
  let daysRemaining = ethiopianDay;
  for (let i = 0; i < 13; i++) {
    const daysInMonth = i === 12 ? (isEthiopianLeapYear(ethiopianYear) ? 6 : 5) : 30;
    if (daysRemaining <= daysInMonth) {
      ethiopianMonth = i + 1;
      ethiopianDay = daysRemaining;
      break;
    }
    daysRemaining -= daysInMonth;
  }
  
  return {
    year: ethiopianYear,
    month: ethiopianMonth,
    day: ethiopianDay
  };
}

/**
 * Convert Ethiopian date to Gregorian date
 */
export function ethiopianToGregorian(ethDate: EthiopianDate): Date {
  const ethYear = ethDate.year;
  const ethMonth = ethDate.month;
  const ethDay = ethDate.day;
  
  // Calculate days from start of Ethiopian year
  let daysFromStart = 0;
  for (let i = 0; i < ethMonth - 1; i++) {
    const daysInMonth = i === 12 ? (isEthiopianLeapYear(ethYear) ? 6 : 5) : 30;
    daysFromStart += daysInMonth;
  }
  daysFromStart += ethDay - 1;
  
  // Ethiopian year starts around September 11 in Gregorian calendar
  const gregorianYear = ethYear + 7;
  const startDate = new Date(gregorianYear, 8, 11); // September 11
  
  const resultDate = new Date(startDate);
  resultDate.setDate(resultDate.getDate() + daysFromStart);
  
  return resultDate;
}

/**
 * Check if Ethiopian year is a leap year
 */
function isEthiopianLeapYear(year: number): boolean {
  return year % 4 === 3;
}

/**
 * Format Ethiopian date as string (DD/MM/YYYY)
 */
export function formatEthiopianDate(date: EthiopianDate): string {
  const day = date.day.toString().padStart(2, '0');
  const month = date.month.toString().padStart(2, '0');
  return `${day}/${month}/${date.year}`;
}

/**
 * Parse Ethiopian date string (DD/MM/YYYY)
 */
export function parseEthiopianDate(dateString: string): EthiopianDate {
  const parts = dateString.split('/');
  return {
    day: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    year: parseInt(parts[2], 10)
  };
}

/**
 * Get current Ethiopian date
 */
export function getCurrentEthiopianDate(): EthiopianDate {
  return gregorianToEthiopian(new Date());
}

/**
 * Get Ethiopian month name in Amharic
 */
export function getEthiopianMonthName(month: number): string {
  if (month < 1 || month > 13) return '';
  return ETHIOPIAN_MONTHS[month - 1];
}

/**
 * Get today's date in Ethiopian calendar format
 * Example: "01/04/2018" (ታኅሣሥ 01, 2018)
 */
export function getTodayEthiopianDateString(): string {
  const today = getCurrentEthiopianDate();
  return formatEthiopianDate(today);
}

/**
 * Get Ethiopian date with month name
 * Example: "ታኅሣሥ 01, 2018"
 */
export function getEthiopianDateWithMonthName(date: EthiopianDate): string {
  const monthName = getEthiopianMonthName(date.month);
  return `${monthName} ${date.day}, ${date.year}`;
}
