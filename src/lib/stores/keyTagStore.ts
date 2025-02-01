import { writable } from 'svelte/store';

export interface KeyTagTemplate {
	id: string;
	name: string;
	description: string;
	width: string;
	height: string;
	orientation: 'portrait' | 'landscape';
	backgroundImage?: string;
	backgroundColor?: string;
	printableArea: {
		width: string;
		height: string;
		marginTop: string;
		marginLeft: string;
	};
}

const defaultTemplates: KeyTagTemplate[] = [
	{
		id: 'versa-tag-standard-yellow',
		name: 'Versa-Tag Standard (Yellow)',
		description: 'Standard yellow key tag with black text',
		width: '1.22in',
		height: '3in',
		orientation: 'portrait',
		backgroundColor: '#FFEB3B',
		printableArea: {
			width: '1.22in',
			height: '3in',
			marginTop: '0',
			marginLeft: '0'
		}
	},
	{
		id: 'versa-tag-narrow-yellow',
		name: 'Versa-Tag Narrow (Yellow)',
		description: 'Narrow yellow key tag with black text',
		width: '1.22in',
		height: '3in',
		orientation: 'portrait',
		backgroundColor: '#FFEB3B',
		printableArea: {
			width: '1.22in',
			height: '3in',
			marginTop: '0',
			marginLeft: '0'
		}
	},
	{
		id: 'versa-tag-white',
		name: 'Versa-Tag (White)',
		description: 'Standard white key tag with black text',
		width: '1.22in',
		height: '3in',
		orientation: 'portrait',
		backgroundColor: '#FFFFFF',
		printableArea: {
			width: '1.22in',
			height: '3in',
			marginTop: '0',
			marginLeft: '0'
		}
	},
	{
		id: 'versa-tag-gray',
		name: 'Versa-Tag (Gray)',
		description: 'Standard gray key tag with black text',
		width: '1.22in',
		height: '3in',
		orientation: 'portrait',
		backgroundColor: '#E0E0E0',
		printableArea: {
			width: '1.22in',
			height: '3in',
			marginTop: '0',
			marginLeft: '0'
		}
	},
	{
		id: 'standard-label',
		name: 'Standard Label',
		description: 'Standard label with black text',
		width: '1.22in',
		height: '3in',
		orientation: 'portrait',
		backgroundColor: '#FFFFFF',
		printableArea: {
			width: '1.22in',
			height: '3in',
			marginTop: '0',
			marginLeft: '0'
		}
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
			update((state) => ({
				...state,
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
