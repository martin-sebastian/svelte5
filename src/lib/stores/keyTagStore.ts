import { writable } from 'svelte/store';

export interface KeyTag {
	id?: string;
	template?: string;
	templates?: Array<{ id: string; name: string }>;
	selectedTemplateId?: string;
	title?: string;
	description?: string;
	created_at?: string;
	updated_at?: string;
	user_id?: string;
	// Add any other properties your KeyTag needs
}

function createKeyTagStore() {
	const { subscribe, set, update } = writable<KeyTag | null>(null);

	return {
		subscribe,
		set: (keyTag: KeyTag) => set(keyTag),
		update: (data: Partial<KeyTag>) =>
			update(
				(currentTag) =>
					({
						...currentTag,
						...data
					}) as KeyTag
			),
		reset: () => set(null)
	};
}

export const keyTagStore = createKeyTagStore();
