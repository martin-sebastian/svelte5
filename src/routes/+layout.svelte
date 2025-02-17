<script lang="ts">
	import '../app.css';
	import { page, navigating } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button';
	const { children } = $props();
	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

{#if $navigating}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
		<div class="rounded-lg bg-white p-4 shadow-lg">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
	</div>
{/if}

<div class="min-h-screen w-full bg-gray-50 dark:bg-gray-900/90">
	<!-- Navigation -->
	<nav
		class="fixed top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90"
	>
		<div class="mx-4">
			<div class="flex h-12 justify-between">
				<!-- Common Nav Items -->
				<a href="/" class="flex items-center" aria-label="DealerOps">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="30"
						height="30"
						fill="currentColor"
						class="bi bi-shield-shaded"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M8 14.933a1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"
						/>
					</svg>
					<span class="ml-2 text-xl font-bold">DealerOps</span>
				</a>

				<!-- Conditional Nav Items -->
				{#if isAdminRoute}
					<div class="flex items-center space-x-4">
						<a href="/admin">Dashboard</a>
						<a href="/admin/vehicles">Vehicles</a>
						<a href="/admin/settings">Settings</a>
						<a href="/admin/account">Account</a>
						<Avatar.Root>
							<Avatar.Image src="/martin.png" alt="Martin" />
							<Avatar.Fallback>MA</Avatar.Fallback>
						</Avatar.Root>
					</div>
				{:else}
					<div class="flex items-center space-x-4">
						<a href="/about" class="font-black italic text-gray-200/50" aria-label="About">About</a>
						<a href="/contact" class="font-black italic text-gray-200/50" aria-label="Contact"
							>Contact</a
						>
						<Button href="/login" aria-label="Login">Login</Button>
					</div>
				{/if}
			</div>
		</div>
	</nav>

	<main>
		{@render children()}
	</main>
</div>
