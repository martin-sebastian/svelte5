<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children } = $props();
	let theme = 'light';

	function toggleTheme() {
		theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', theme);
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			theme =
				localStorage.getItem('theme') ||
				(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			}
		}
	});
</script>

<nav
	class="fixed z-40 flex w-full justify-center border-b bg-background/50 py-1 backdrop-blur-sm print:hidden"
>
	<div class="flex-none">
		<Button href="/" variant="outline" class="ml-1">
			<svg
				class="flex-cal flex"
				width="36"
				height="36"
				data-name="Layer 1"
				viewBox="0 0 48 48"
				fill="none"
				aria-hidden="true"
			>
				<path
					class="part-1"
					d="M40.38,37.14c-3.38,1.95-12.53,7.2-15.64,9.01-.44.25-.97.25-1.42,0-6.52-3.71-13.05-7.42-19.59-11.11-.55-.31-.88-.9-.87-1.53.02-1.52.01-3.04,0-4.62,0-.39.41-.64.75-.45,2.94,1.64,13.76,7.72,19.61,11.03.5.28,1.1.27,1.59-.02,1.47-.86,2.96-1.69,4.44-2.53.18-.1.35-.21.58-.35-.2-.13-.35-.24-.5-.33-5.6-3.16-11.21-6.32-16.82-9.45-.61-.34-.98-.98-.97-1.67.03-2.3.02-6.32.02-8.1,0-.39.42-.63.76-.44,1.18.69,3.14,1.84,3.81,2.21.37.2.49.45.48.85-.02.71,0,1.43,0,2.14,0,.51.27.99.71,1.24,6.88,3.94,19.79,11.37,23.06,13.25.34.2.34.68,0,.88Z"
				/>
				<path
					class="part-2"
					d="M8.7,4.72c-2.46-1.4-4.45-2.52-5.33-3.02-.23-.13-.5.04-.5.29-.02,2.61-.03,13.49-.04,19.12,0,.28.15.53.39.66,1.34.73,4.91,2.71,5.46,3.02l.03-20.08Z"
				/>
				<path
					class="part-3"
					d="M36.12,20.47c-1.13-.68-5.26-3.06-6.27-3.65.01,0,.02-.01.03-.02l-6.05-3.49c-.09-.02-.19-.05-.27-.1-2.93-1.68-7.21-4.13-11.12-6.36-.41-.23-.91.07-.91.54v5.6l24.94,14.42c.13-.55.02-6.25.02-6.25,0,0-.14-.56-.37-.7Z"
				/>
				<path
					class="part-4"
					d="M43.95,2.11c-3,1.69-10.84,6.16-16.54,9.42-.33.19-.32.65,0,.84l4.83,2.79c.15.09.34.09.49,0,1.97-1.13,3.93-2.26,5.92-3.4.32-.19.73.04.73.42,0,2.78,0,11.7-.01,16.34,0,.41.1.65.48.84.62.32,3.14,1.79,4.6,2.64.32.19.73-.05.73-.42V2.83c0-.63-.68-1.03-1.23-.72Z"
				/>
			</svg>
		</Button>
	</div>
	<div class="flex-grow justify-start align-middle">
		<Button href="/admin/vehicles" variant="outline" class="mx-1">Dashboard</Button>
	</div>
	<div class="flex-none">
		<Button href="/admin/sync" variant="outline">
			<div class="relative flex h-6 w-6 items-center justify-center">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-settings"
					aria-label="Sync"
					><path
						d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
					/><circle cx="12" cy="12" r="3" /></svg
				>
			</div>
		</Button>
		<Button onclick={toggleTheme} variant="outline">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-sun absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" /><path d="M12 20v2" />
				<path d="m4.93 4.93 1.41 1.41" />
				<path d="m17.66 17.66 1.41 1.41" />
				<path d="M2 12h2" /><path d="M20 12h2" />
				<path d="m6.34 17.66-1.41 1.41" />
				<path d="m19.07 4.93-1.41 1.41" />
			</svg>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-moon rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
		</Button>

		<Button href="/admin/auth" variant="outline" class="mr-1">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-user"
			>
				<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		</Button>
	</div>
</nav>

<main class="flex min-h-screen flex-col bg-background text-foreground">
	{@render children()}
</main>

<style>
	.part-1 {
		fill: gray;
	}
	.part-2 {
		fill: blue;
	}
	.part-3 {
		fill: blue;
	}
	.part-4 {
		fill: blue;
	}
	.part-1:hover {
		fill: orange;
	}
	.part-2:hover {
		fill: orange;
	}
	.part-3:hover {
		fill: orange;
	}
	.part-4:hover {
		fill: orange;
	}
</style>
