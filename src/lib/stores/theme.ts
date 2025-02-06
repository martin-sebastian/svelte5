import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const { subscribe, set } = writable<Theme>(
		(browser && (localStorage.getItem('theme') as Theme)) || 'dark'
	);

	return {
		subscribe,
		toggle: () => {
			if (browser) {
				const current = localStorage.getItem('theme') as Theme;
				const next = current === 'dark' ? 'light' : 'dark';
				localStorage.setItem('theme', next);
				set(next);
			}
		}
	};
}

export const theme = createThemeStore();

// Update HTML class when theme changes
if (browser) {
	theme.subscribe((value) => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(value);
	});
}
