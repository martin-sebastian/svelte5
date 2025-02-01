import type { KeyTagTemplate } from '$lib/types/keyTag';

const defaultTemplates: KeyTagTemplate[] = [
	{
		id: 'versa-tag-standard',
		name: 'Versa-Tag Standard',
		width: '3in',
		height: '3in',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		},
		backgroundImage: '/images/versa-tag-3x3.png',
		backgroundColor: '#ffeb3b',
		orientation: 'landscape',
		description: 'Standard yellow self-laminating key tag'
	},
	{
		id: 'standard-label',
		name: 'Standard Label',
		width: '2in',
		height: '1.5in',
		printableArea: {
			width: '1.875in',
			height: '1.375in',
			marginTop: '0.0625in',
			marginLeft: '0.0625in'
		},
		backgroundImage: '', // We can add a background image later if needed
		backgroundColor: '#ffffff',
		orientation: 'landscape',
		description: 'Original 1.5 x 2 inch label'
	}
	// ... other templates
];

export const keyTagStore = {
	templates: defaultTemplates,
	selectedTemplateId: defaultTemplates[0].id
};
