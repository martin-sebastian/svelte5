import { state } from 'svelte';
import type { KeyTagTemplate } from '$lib/types/keyTag';

const defaultTemplates: KeyTagTemplate[] = [
	{
		id: 'versa-tag-standard-yellow',
		name: 'Versa-Tag Standard Yellow',
		description: 'Standard yellow self-laminating key tag',
		width: '3in',
		height: '3in',
		orientation: 'landscape',
		backgroundImage: '/images/versa-tag-3x3-yellow-custom.png',
		backgroundColor: '#ffeb3b',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		}
	}
	// ... other templates
];

export const keyTagStore = state({
	templates: defaultTemplates,
	selectedTemplateId: defaultTemplates[0].id
});
