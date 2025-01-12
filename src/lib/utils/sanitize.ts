import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
	if (typeof window === 'undefined') return html;
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'span'],
		ALLOWED_ATTR: []
	});
}

export function stripHtmlAndFormatText(html: string): string {
	// First sanitize the HTML
	const sanitized = sanitizeHtml(html);

	// Create a temporary element to parse HTML
	const tmp = document.createElement('DIV');
	tmp.innerHTML = sanitized;
	const text = tmp.textContent || tmp.innerText || '';

	// Format the text
	return text
		.replace(/(\r\n|\n|\r)/gm, ', ') // Replace line breaks with comma
		.replace(/\s+/g, ' ') // Replace multiple spaces with single space
		.replace(/,\s*,/g, ',') // Replace multiple commas with single comma
		.replace(/\s*,\s*/g, ', ') // Ensure proper spacing around commas
		.trim();
}
