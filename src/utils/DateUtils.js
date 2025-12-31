// src/utils/DateUtils.js

/**
 * Date utility functions for formatting dates in various formats
 */

/**
 * Format date to: 10-Aug-2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatShortDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Format date to: 10-August-2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatLongDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Format date to: 10-08-2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatNumericDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Format date to: August 10, 2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatMonthDayYear = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

/**
 * Format date to: 2025-08-10 (ISO format)
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatISODate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${year}-${month}-${day}`;
};

/**
 * Format date to: 10/08/2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatSlashDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date to: Aug 10, 2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatShortMonthDayYear = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

/**
 * Format date to: 10-Aug-25
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatShortYearDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear().toString().slice(-2);
  
  return `${day}-${month}-${year}`;
};

/**
 * Format date to: Monday, August 10, 2025
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatFullDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format date to custom format
 * @param {Date|string} date - Date object or date string
 * @param {string} format - Format string (e.g., 'DD-MM-YYYY', 'MM/DD/YY')
 * @returns {string} Formatted date string
 */
export const formatCustomDate = (date, format) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const shortMonth = d.toLocaleString('default', { month: 'short' });
  const longMonth = d.toLocaleString('default', { month: 'long' });
  const fullYear = d.getFullYear();
  const shortYear = fullYear.toString().slice(-2);
  const weekday = d.toLocaleString('default', { weekday: 'long' });
  const shortWeekday = d.toLocaleString('default', { weekday: 'short' });
  
  const replacements = {
    'DD': day,
    'D': d.getDate(),
    'MM': month,
    'M': (d.getMonth() + 1),
    'MMM': shortMonth,
    'MMMM': longMonth,
    'YYYY': fullYear,
    'YY': shortYear,
    'dddd': weekday,
    'ddd': shortWeekday
  };
  
  return format.replace(
    /DD|D|MM|M|MMM|MMMM|YYYY|YY|dddd|ddd/g, 
    match => replacements[match] || match
  );
};

/**
 * Get current date in specified format
 * @param {string} format - Format type (optional)
 * @returns {string} Formatted current date
 */
export const getCurrentDate = (format = 'short') => {
  const now = new Date();
  
  const formats = {
    'short': formatShortDate(now),
    'long': formatLongDate(now),
    'numeric': formatNumericDate(now),
    'monthDayYear': formatMonthDayYear(now),
    'iso': formatISODate(now),
    'slash': formatSlashDate(now),
    'shortMonthDayYear': formatShortMonthDayYear(now),
    'shortYear': formatShortYearDate(now),
    'full': formatFullDate(now)
  };
  
  return formats[format] || formatShortDate(now);
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string in various formats
 * @returns {Date} Date object
 */
export const parseDate = (dateString) => {
  // Try multiple date formats
  const formats = [
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'MM-DD-YYYY',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY/MM/DD'
  ];
  
  for (const format of formats) {
    const date = parseWithFormat(dateString, format);
    if (date && !isNaN(date.getTime())) {
      return date;
    }
  }
  
  return new Date(dateString);
};

/**
 * Helper function to parse date with specific format
 */
const parseWithFormat = (dateString, format) => {
  const parts = dateString.split(/[-/]/);
  const formatParts = format.split(/[-/]/);
  
  if (parts.length !== formatParts.length) return null;
  
  let year, month, day;
  
  for (let i = 0; i < formatParts.length; i++) {
    if (formatParts[i] === 'YYYY') {
      year = parseInt(parts[i], 10);
    } else if (formatParts[i] === 'MM') {
      month = parseInt(parts[i], 10) - 1;
    } else if (formatParts[i] === 'DD') {
      day = parseInt(parts[i], 10);
    }
  }
  
  return new Date(year, month, day);
};

/**
 * Add days to a date
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Compare two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} 1 if date1 > date2, -1 if date1 < date2, 0 if equal
 */
export const compareDates = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (d1 > d2) return 1;
  if (d1 < d2) return -1;
  return 0;
};

// Default export with all functions
const DateUtils = {
  formatShortDate,
  formatLongDate,
  formatNumericDate,
  formatMonthDayYear,
  formatISODate,
  formatSlashDate,
  formatShortMonthDayYear,
  formatShortYearDate,
  formatFullDate,
  formatCustomDate,
  getCurrentDate,
  parseDate,
  addDays,
  compareDates
};

export default DateUtils;