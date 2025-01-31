<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { ShieldPlus } from 'lucide-svelte';
	import { Settings } from 'lucide-svelte';
	import { Grip } from 'lucide-svelte';
	import { User } from 'lucide-svelte';
	import { Moon } from 'lucide-svelte';
	import { Sun } from 'lucide-svelte';
	import { LayoutDashboard } from 'lucide-svelte';
	import { Bike } from 'lucide-svelte';
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
	class="fixed z-40 flex w-full justify-center border-b bg-background/50 py-1 shadow-sm backdrop-blur-sm print:hidden"
>
	<div class="flex items-center">
		<a href="/" class="mx-4 p-1" aria-label="Home">
			<div class="flex flex-row items-center">
				<ShieldPlus class="h-8 w-8" />
				<div class="hidden sm:flex">
					<span class="font-bold">DEALER</span><span class="font-black">OPS</span>
				</div>
			</div>
		</a>
		<Button href="/admin" variant="outline" class="mx-1 p-3">
			<LayoutDashboard /> <span class="hidden sm:block">Dashboard</span>
		</Button>
		<Button href="/admin/vehicles" variant="outline" class="mx-1 p-3">
			<Bike /> <span class="hidden sm:block">Inventory</span>
		</Button>
	</div>
	<div class="flex-grow justify-center gap-0 align-middle"></div>
	<div class="flex flex-row items-center justify-end">
		<Button onclick={toggleTheme} variant="outline" class="mx-1 my-1">
			<Sun class="dark:hidden" />
			<Moon class="hidden dark:block" />
		</Button>
		<Button href="/auth" variant="outline" class="mx-1 my-1">
			<User class="h-4 w-4" />
		</Button>

		<Button href="/admin" variant="outline" class="my-1 ml-1 mr-2">
			<Settings class="h-4 w-4" />
		</Button>
	</div>
</nav>

<main class="flex min-h-screen flex-col bg-background align-middle text-foreground">
	{@render children()}
</main>

<style>
	@media print {
		main {
			background-color: white !important;
			background: none !important;
		}
	}
</style>
