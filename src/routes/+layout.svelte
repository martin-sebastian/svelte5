<script lang="ts">
	const { children, data } = $props();
	import '../app.css';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { theme } from '$lib/stores/themeStore';
	import {
		ShieldPlus,
		Gauge,
		Settings,
		ScanBarcode,
		Sun,
		Moon,
		User,
		Users,
		DatabaseZap,
		LogOut,
		ArrowDown
	} from 'lucide-svelte';

	let isLoading = $state(false);
	let isAuthenticated = $state(false);
	let userEmail = $state<string | null>(null);
	let isExpanded = $state(false);

	// Initial auth check and setup
	onMount(() => {
		// Initial auth check
		supabase.auth
			.getUser()
			.then(({ data: { user }, error }) => {
				if (!error && user) {
					isAuthenticated = true;
					userEmail = user.email ?? null;
				}
			})
			.catch((err) => {
				console.error('Initial auth check failed:', err);
			});

		// Listen for auth changes
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (event) => {
			if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
				const {
					data: { user },
					error
				} = await supabase.auth.getUser();
				if (!error && user) {
					isAuthenticated = true;
					userEmail = user.email ?? null;
				}
				invalidate('supabase:auth');
			} else if (event === 'SIGNED_OUT') {
				isAuthenticated = false;
				userEmail = null;
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	async function handleLogout() {
		try {
			isLoading = true;
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			await goto('/');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			isLoading = false;
		}
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	// Apply theme class to document
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add($theme);
		}
	});
</script>

{#if isLoading}
	<div class="flex h-screen items-center justify-center">
		<div
			class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white"
		></div>
	</div>
{:else}
	<div class="min-h-screen bg-background">
		{#if isAuthenticated}
			<nav
				class="fixed z-40 flex w-full justify-between border-b border-background/25 bg-background/50 shadow-sm backdrop-blur-md print:hidden"
			>
				<div class="flex flex-row items-center">
					<a href="/admin" class="mx-4" aria-label="Home">
						<div class="flex flex-row items-center">
							<ShieldPlus class="h-8 w-8" />
							<div class="hidden sm:flex">
								<span class="font-bold">DEALER</span><span class="font-black">OPS</span>
							</div>
						</div>
					</a>
					<Button href="/admin/" variant="outline" class="mx-1">
						<Gauge /> <span class="hidden sm:block">Dashboard</span>
					</Button>
					<Button href="/admin/vehicles" variant="outline" class="mx-1">
						<ScanBarcode /> <span class="hidden sm:block">Inventory</span>
					</Button>
				</div>
				<div class="flex flex-row items-center justify-end">
					<Button href="/admin/sync" variant="outline" class="mx-1 my-1">
						<DatabaseZap class="h-4 w-4" /> <span class="text-sm">Sync</span>
					</Button>
					<Button href="/admin/users" variant="outline" class="mx-1 my-1 ml-1">
						<Users class="h-4 w-4" />
						<span class="text-sm">Users</span>
					</Button>
					<Button href="/admin/settings" variant="outline" class="mx-1 my-1">
						<Settings class="h-4 w-4" /> <span class="text-sm">Settings</span>
					</Button>
					<Button onclick={() => theme.toggle()} variant="outline" class="mx-1 my-1">
						<Sun class="dark:hidden" />
						<Moon class="hidden dark:block" />
					</Button>
					<Button href="/admin/profile" variant="outline" class="mx-1 my-1">
						<User class="h-4 w-4" />
					</Button>
					<Button onclick={handleLogout} variant="outline" class="my-1 ml-1 mr-4">
						<LogOut class="h-4 w-4" />
					</Button>
				</div>
			</nav>
			<div class="min-h-screen">
				{@render children()}
			</div>
		{:else if typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')}
			<div class="flex h-screen items-center justify-center">
				<div class="text-center">
					<p class="text-lg">Please log in to access the admin area</p>
					<Button href="/" variant="outline">Go to Login</Button>
				</div>
			</div>
		{:else}
			{@render children()}
		{/if}
	</div>
{/if}

{#if import.meta.env.DEV}
	<div class="fixed bottom-0 bg-gray-900/90 py-2 text-xs text-white">
		<div class="mx-4 flex items-center justify-between">
			<button onclick={toggleExpand} class="flex items-center">
				<span class="mr-4">
					Status:
					{#if isAuthenticated}
						<span class="text-green-400">Authenticated</span>
					{:else}
						<span class="text-red-400">Not Authenticated</span>
					{/if}
				</span>
				<span>
					Email: <span class="text-blue-400">{userEmail || 'None'}</span>
				</span>
			</button>
			<div>
				Session ID: {data.session?.access_token ? data.session.access_token.slice(-8) : 'None'}
			</div>
		</div>
		{#if isExpanded}
			<div class="fixed bottom-0 h-1/2 overflow-y-auto bg-gray-800">
				<button onclick={toggleExpand} class="flex items-center">
					<ArrowDown class="mr-2 h-4 w-4" />
				</button>
				<h3 class="text-white">Additional Data</h3>
				<pre class="text-white">
					{JSON.stringify(data, null, 2)}
				</pre>
			</div>
		{/if}
	</div>
{/if}
