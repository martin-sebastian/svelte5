import { writable } from 'svelte/store';
import type { KeyTagTemplate } from '$lib/types/keyTag';

const defaultTemplates: KeyTagTemplate[] = [
	{
		id: 'versa-tag-standard-yellow',
		name: 'Versa-Tag Standard Yellow',
		width: '3in',
		height: '3in',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		},
		backgroundImage: '/images/versa-tag-3x3-yellow-custom.png',
		backgroundColor: '#ffeb3b',
		orientation: 'landscape',
		description: 'Standard yellow self-laminating key tag'
	},
	{
		id: 'versa-tag-narrow-yellow',
		name: 'Versa-Tag Narrow Yellow',
		width: '1.22in',
		height: '3in',
		printableArea: {
			width: '1.22in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		},
		backgroundImage: '/images/versa-tag-narrow-yellow.png',
		backgroundColor: '#ffeb3b',
		orientation: 'portrait',
		description: 'Narrow yellow self-laminating key tag'
	},
	{
		id: 'versa-tag-white',
		name: 'Versa-Tag White',
		width: '3in',
		height: '3in',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		},
		backgroundImage: '/images/versa-tag-3x3-white.png',
		backgroundColor: '#ffffff',
		orientation: 'landscape',
		description: 'Standard white self-laminating key tag'
	},
	{
		id: 'versa-tag-gray',
		name: 'Versa-Tag Gray',
		width: '3in',
		height: '3in',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		},
		backgroundImage: '/images/versa-tag-3x3-gray.png',
		backgroundColor: '#ffffff',
		orientation: 'landscape',
		description: 'Standard gray self-laminating key tag'
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
		backgroundImage: '',
		backgroundColor: '#ffffff',
		orientation: 'landscape',
		description: 'Original 1.5 x 2 inch label'
	}
];

function createKeyTagStore() {
	const { subscribe, set, update } = writable({
		templates: defaultTemplates,
		selectedTemplateId: defaultTemplates[0].id
	});

	return {
		subscribe,
		setSelectedTemplateId: (id: string) =>
			update((store) => ({
				...store,
				selectedTemplateId: id
			})),
		reset: () =>
			set({
				templates: defaultTemplates,
				selectedTemplateId: defaultTemplates[0].id
			})
	};
}

export const keyTagStore = createKeyTagStore();
