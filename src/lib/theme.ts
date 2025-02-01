import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const theme = writable<Theme>(
		typeof localStorage !== 'undefined'
			? (localStorage.getItem('theme') as Theme) ||
					(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: 'light'
	);

	return {
		subscribe: theme.subscribe,
		toggle: () => {
			theme.update((current) => {
				const newTheme = current === 'dark' ? 'light' : 'dark';
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('theme', newTheme);
					if (newTheme === 'dark') {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
				}
				return newTheme;
			});
		},
		set: (value: Theme) => {
			theme.set(value);
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('theme', value);
				if (value === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		}
	};
}

export const theme = createThemeStore();
