import { writable } from 'svelte/store';

function createThemeStore() {
	// Get initial theme from localStorage or default to 'light'
	const defaultTheme =
		typeof localStorage !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';

	const { subscribe, set, update } = writable<string>(defaultTheme);

	return {
		subscribe,
		set: (value: string) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('theme', value);
			}
			set(value);
		},
		toggle: () => {
			update((current) => {
				const newTheme = current === 'dark' ? 'light' : 'dark';
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('theme', newTheme);
				}
				return newTheme;
			});
		}
	};
}

export const theme = createThemeStore();
