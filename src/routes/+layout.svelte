<script lang="ts">
	const { children, data } = $props();
	import '../app.css';
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { theme } from '$lib/stores/themeStore';
	import { ShieldPlus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Gauge,
		ScanBarcode,
		DatabaseZap,
		Users,
		Settings,
		Sun,
		Moon,
		User,
		LogOut
	} from 'lucide-svelte';

	let isLoading = $state(true);
	let isAuthenticated = $state(false);

	$effect(() => {
		const { session } = data;
		isAuthenticated = !!session;
		isLoading = false;
	});

	// Listen for auth changes
	$effect(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => subscription.unsubscribe();
	});

	async function handleLogout() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			await goto('/auth');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	// Apply theme class to document
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add($theme);
		}
	});

	function handleInventoryClick(e: MouseEvent) {
		if ($navigating) {
			e.preventDefault();
			return;
		}
		const target = e.currentTarget as HTMLButtonElement;
		target.classList.add('opacity-50');
		target.disabled = true;
		setTimeout(() => {
			target.classList.remove('opacity-50');
			target.disabled = false;
		}, 2000);
	}
</script>

{#if isLoading}
	<div class="flex h-screen items-center justify-center">
		<div
			class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white"
		></div>
	</div>
{:else}
	<div class="min-h-screen w-full bg-background text-foreground">
		{#if isAuthenticated}
			<nav
				class="fixed z-40 flex w-full justify-center border-b border-gray-400/25 bg-background/90 py-2 shadow-sm backdrop-blur-md print:hidden"
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
						<Gauge /> <span class="hidden sm:block">Dashboard</span>
					</Button>
					<Button
						href="/admin/vehicles"
						variant="outline"
						class="mx-1 p-3"
						data-sveltekit-preload-data="off"
						onclick={handleInventoryClick}
					>
						<ScanBarcode />
						<span class="hidden sm:block">
							{#if $navigating}Loading...{:else}Inventory{/if}
						</span>
					</Button>
				</div>
				<div class="flex-grow justify-center gap-1 align-middle"></div>
				<div class="flex flex-row items-center justify-end">
					<Button href="/admin/sync" variant="outline" class="mx-1 my-1">
						<DatabaseZap class="h-4 w-4" /> Sync
					</Button>
					<Button href="/admin/users" variant="outline" class="mx-1 my-1 ml-1">
						<Users class="h-4 w-4" />
						<span class="text-sm">Users</span>
					</Button>
					<Button href="/admin/settings" variant="outline" class="mx-1 my-1">
						<Settings class="h-4 w-4" /> Settings
					</Button>
					<Button onclick={() => theme.toggle()} variant="outline" class="mx-1 my-1">
						<Sun class="dark:hidden" />
						<Moon class="hidden dark:block" />
					</Button>
					<Button variant="outline" class="mx-1 my-1">
						<User class="h-4 w-4" />
					</Button>
					<Button onclick={handleLogout} variant="outline" class="my-1 ml-1 mr-4">
						<LogOut class="h-4 w-4" />
					</Button>
				</div>
			</nav>
			<main class="">
				{@render children()}
			</main>
		{:else}
			{@render children()}
		{/if}
	</div>
{/if}
