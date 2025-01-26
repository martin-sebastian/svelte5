<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';

	const { children } = $props();
	let theme = $state('light');

	function toggleTheme() {
		theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', theme);
	}

	onMount(() => {
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
	<div class="flex">
		<a href="/" class="mx-4 p-1" aria-label="Home">
			<svg
				id="Layer_1"
				data-name="Layer 1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 32.5 23.32"
				class="h-[28px] w-[40px]"
			>
				<g>
					<path
						class="cls-1"
						d="M4.14,0c.84,0,1.42.58,1.42,1.42v4.37c0,.84-.58,1.42-1.42,1.42H.38V0h3.76ZM3.78,5.85c.22,0,.34-.12.34-.34V1.7c0-.22-.12-.34-.34-.34h-1.95v4.49h1.95Z"
					/>
					<polygon
						class="cls-1"
						points="10.69 5.85 7.42 5.85 7.42 4.21 10.07 4.21 10.07 2.84 7.42 2.84 7.42 1.36 10.69 1.36 10.69 0 5.98 0 5.98 7.21 10.34 7.21 10.69 6.1 10.69 5.85"
					/>
					<path class="cls-1" d="M17.84,0v5.85h3.02v1.36h-4.47V0h1.44Z" />
					<path
						class="cls-1"
						d="M14.65,0h-1.68l-2.32,7.21h1.49l.48-1.62h2.33l.47,1.62h.67v-2.74l-1.44-4.47ZM13.02,4.23l.78-2.64.76,2.64h-1.54Z"
					/>
					<path
						class="cls-1"
						d="M25.9,0v1.36h-3.28v1.48h2.65v1.36h-2.65v1.64h3.28v1.36h-4.72V0h4.72Z"
					/>
					<path
						class="cls-1"
						d="M29.93,7.21l-1.16-2.67h-1.16v2.67h-1.44V0h3.68c.84,0,1.42.58,1.42,1.42v1.69c0,.68-.38,1.19-.98,1.36l1.2,2.73h-1.55ZM29.82,1.7c0-.22-.12-.34-.34-.34h-1.87v1.83h1.87c.22,0,.34-.12.34-.34v-1.15Z"
					/>
				</g>
				<path
					class="cls-2"
					d="M7.68,8.73c1.68,0,2.85,1.16,2.85,2.85v8.9c0,1.68-1.16,2.85-2.85,2.85H2.85c-1.68,0-2.85-1.16-2.85-2.85v-8.9c0-1.68,1.16-2.85,2.85-2.85h4.83ZM7.64,12.14c0-.44-.24-.68-.68-.68h-3.39c-.44,0-.68.24-.68.68v7.78c0,.44.24.68.68.68h3.39c.44,0,.68-.24.68-.68v-7.78Z"
				/>
				<path
					class="cls-2"
					d="M29.46,12.14c0-.44-.24-.68-.68-.68h-2.89c-.44,0-.68.24-.68.68v1.36c0,.44.24.58.68.68l3.73.8c1.56.34,2.89,1.28,2.89,2.89v2.61c0,1.68-1.16,2.85-2.85,2.85h-4.49c-1.68,0-2.85-1.16-2.85-2.85v-1.84h2.81v1.28c0,.44.24.68.68.68h3.13c.44,0,.68-.24.68-.68v-1.52c0-.44-.24-.58-.68-.68l-3.73-.8c-1.56-.34-2.89-1.28-2.89-2.89v-2.45c0-1.68,1.16-2.85,2.85-2.85h4.25c1.68,0,2.85,1.16,2.85,2.85v1.68h-2.81v-1.12Z"
				/>
				<path
					class="cls-2"
					d="M18.72,8.81h-7.38v14.43h2.89v-5.09h4.49c1.68,0,2.85-1.16,2.85-2.85v-3.65c0-1.68-1.16-2.85-2.85-2.85ZM19.25,14c0,.12-.08.18-.23.18h-1.93v1.92c0,.15-.06.23-.18.23h-1.02c-.12,0-.18-.08-.18-.23v-1.92h-1.92c-.15,0-.23-.06-.23-.18v-1.02c0-.06.02-.1.07-.13s.1-.05.16-.05h1.92v-1.93c0-.15.06-.23.18-.23h1.02c.12,0,.18.08.18.23v1.93h1.93c.06,0,.11.02.16.05.05.03.07.08.07.13v1.02Z"
				/>
			</svg>
		</a>
	</div>
	<div class="flex-grow justify-start align-middle">
		<Button href="/admin/vehicles" variant="outline" class="mx-1">Vehicles</Button>
	</div>
	<div class="flex-none">
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
	</div>
</nav>

<main class="flex min-h-screen flex-col bg-background text-foreground">
	{@render children()}
</main>

<style>
	.cls-1 {
		fill: #00e;
	}

	.cls-2 {
		fill: #555;
	}
	@media print {
		main {
			background-color: white !important;
			background: none !important;
		}
	}
</style>
