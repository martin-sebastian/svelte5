<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ShieldPlus, Sun, Moon, User } from 'lucide-svelte';
	import '../app.css';

	const { children } = $props();

	// Any client-side only code goes here
	let theme = $state(
		typeof localStorage !== 'undefined'
			? localStorage.getItem('theme') ||
					(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: 'light'
	);

	$effect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('theme', theme);
	});
</script>

<nav
	class="fixed z-40 flex w-full justify-center border-b border-gray-600/25 bg-gray-900/90 py-1 backdrop-blur-md print:hidden"
>
	<div class="flex items-center">
		<a href="/" class="mx-2 p-1" aria-label="Home">
			<div class="flex flex-row items-center">
				<ShieldPlus class="mx-1 h-7 w-7" />
				<div class="hidden sm:flex">
					<span class="font-bold">DEALER</span><span class="font-black">OPS</span>
				</div>
			</div>
		</a>
	</div>
	<div class="flex-grow justify-center gap-0 align-middle"></div>
	<div class="flex flex-row items-center justify-end">
		<Button onclick={() => theme.toggle()} variant="outline" class="mx-1 my-1">
			<Sun class="dark:hidden" />
			<Moon class="hidden dark:block" />
		</Button>
		<Button href="/auth" variant="outline" class="my-1 ml-1 mr-4">
			<User class="h-4 w-4" />
			<span class="text-sm">Login</span>
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
