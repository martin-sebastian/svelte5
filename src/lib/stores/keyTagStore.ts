import { writable } from 'svelte/store';

export interface KeyTag {
	id?: string;
	template?: string;
	templates?: Array<{
		id: string;
		name: string;
		width: string;
		height: string;
		backgroundImage?: string;
		backgroundColor?: string;
		printableArea: {
			width: string;
			height: string;
			marginTop: string;
			marginLeft: string;
		};
	}>;
	selectedTemplateId?: string;
	title?: string;
	description?: string;
	created_at?: string;
	updated_at?: string;
	user_id?: string;
	// Add any other properties your KeyTag needs
}

function createKeyTagStore() {
	const defaultTemplates = [
		{
			id: 'versa-tag-standard-yellow',
			name: 'Standard Yellow',
			width: '3.5in',
			height: '2.25in',
			backgroundColor: '#FFEB3B',
			printableArea: {
				width: '3.25in',
				height: '2in',
				marginTop: '0.125in',
				marginLeft: '0.125in'
			}
		}
		// Add other templates...
	];

	const { subscribe, set, update } = writable<KeyTag>({
		templates: defaultTemplates,
		selectedTemplateId: 'versa-tag-standard-yellow'
	});

	return {
		subscribe,
		set,
		update,
		reset: () =>
			set({ templates: defaultTemplates, selectedTemplateId: 'versa-tag-standard-yellow' })
	};
}

export const keyTagStore = createKeyTagStore();
