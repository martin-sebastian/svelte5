<script lang="ts">
	import { page } from '$app/stores';
	import PublicNav from '$lib/components/PublicNav.svelte';
	import '../app.css';

	const { children } = $props();
	let theme = $state(
		typeof localStorage !== 'undefined'
			? localStorage.getItem('theme') ||
					(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: 'light'
	);

	// We need this check to prevent double navigation
	const showNav = $derived(
		!$page.url.pathname.startsWith('/auth') && !$page.url.pathname.startsWith('/admin')
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

{#if showNav}
	<PublicNav />
{/if}

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
