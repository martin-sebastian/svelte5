<script lang="ts">
	import '../app.css';
	import { page, navigating } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();
	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));

	// Set initial state to false for icon-only mode
	let sidebarOpen = $state(false);
</script>

<Sidebar.Provider bind:open={sidebarOpen}>
	<AppSidebar />
	<main class="min-h-screen w-full bg-gray-50 dark:bg-gray-900/90">
		<Sidebar.Trigger class="absolute left-16 top-2 z-10" />
		{@render children?.()}
	</main>
</Sidebar.Provider>
