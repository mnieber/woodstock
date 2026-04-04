/**
 * Formats an ISO timestamp for display.
 * Returns both relative time ("2 hours ago") and absolute time.
 */

const TIME_UNITS = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
];

export const formatTimestampRelative = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 5) {
    return 'just now';
  }

  for (const unit of TIME_UNITS) {
    const count = Math.floor(diffSeconds / unit.seconds);
    if (count >= 1) {
      return `${count} ${unit.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export const formatTimestampAbsolute = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  return date.toLocaleString();
};

export const formatTimestamp = (
  isoTimestamp: string,
  format: 'relative' | 'absolute' = 'absolute'
): string => {
  if (format === 'relative') {
    return formatTimestampRelative(isoTimestamp);
  }
  return formatTimestampAbsolute(isoTimestamp);
};

/**
 * Converts a date input to ISO string for use in API queries.
 * Accepts date strings in various formats and returns ISO 8601 format.
 */
export const toISODateString = (dateInput: string): string => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return date.toISOString();
};
