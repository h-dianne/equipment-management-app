/**
 * Formats a date string to a localized Japanese date format
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "2023年5月15日")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
