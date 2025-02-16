<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	const { children } = $props();
	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Navigation -->
	<nav class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<!-- Common Nav Items -->
				<a href="/" class="flex items-center">Logo</a>

				<!-- Conditional Nav Items -->
				{#if isAdminRoute}
					<div class="flex items-center space-x-4">
						<a href="/admin/vehicles">Vehicles</a>
						<a href="/admin/settings">Settings</a>
						<Avatar.Root>
							<Avatar.Image src="/martin.png" alt="Martin" />
							<Avatar.Fallback>MA</Avatar.Fallback>
						</Avatar.Root>
					</div>
				{:else}
					<div class="flex items-center space-x-4">
						<a href="/about">About</a>
						<a href="/contact">Contact</a>
					</div>
				{/if}
			</div>
		</div>
	</nav>

	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>
