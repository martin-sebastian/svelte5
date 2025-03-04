/**
 * Format a date to a string
 * @param date Date to format
 * @param format Optional format (defaults to ISO string)
 */
export function formatDate(date: Date | string | number, format?: string): string {
	const d = date instanceof Date ? date : new Date(date);
	
	// Default to ISO string if no format specified
	if (!format) {
		return d.toISOString();
	}
	
	// Simple custom format implementation could be added here
	// For now just return ISO string
	return d.toISOString();
} 