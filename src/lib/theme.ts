import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'system';

const themeStore = writable<Theme>('system');

if (browser) {
	const savedTheme = localStorage.getItem('theme') as Theme;
	if (savedTheme) {
		themeStore.set(savedTheme);
		document.documentElement.classList.toggle('dark', savedTheme === 'dark');
	}
}

export const theme = {
	subscribe: themeStore.subscribe,
	set: (value: Theme) => {
		if (browser) {
			localStorage.setItem('theme', value);
			document.documentElement.classList.toggle('dark', value === 'dark');
			themeStore.set(value);
		}
	}
};

export function toggleMode() {
	if (browser) {
		const isDark = document.documentElement.classList.contains('dark');
		const newTheme = isDark ? 'light' : 'dark';
		theme.set(newTheme);
	}
}
