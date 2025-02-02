<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ShieldPlus, LogOut, LayoutDashboard, Bike, DatabaseZap } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { children } = $props();

	async function handleLogout() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error('Logout failed:', error.message);
				return;
			}
			goto('/auth');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<nav
	class="fixed z-40 flex w-full justify-center border-b bg-gray-900/75 py-1 shadow-sm backdrop-blur-lg print:hidden"
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
		<Button href="/admin/sync" variant="outline" class="mx-1 my-1">
			<DatabaseZap class="h-4 w-4" />
		</Button>
		<Button onclick={handleLogout} variant="outline" class="mx-1 my-1">
			<LogOut class="h-4 w-4" />
		</Button>
	</div>
</nav>

<!-- Add padding-top to account for fixed nav -->
<main class="flex min-h-screen flex-col bg-background align-middle text-foreground">
	{@render children()}
</main>
