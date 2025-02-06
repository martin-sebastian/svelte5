<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
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
		LogOut
	} from 'lucide-svelte';

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
	class="fixed flex w-full justify-center border-b border-background/25 bg-background/75 py-1 shadow-md backdrop-blur-md print:hidden"
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
		<Button href="/admin/vehicles" variant="outline" class="mx-1 p-3">
			<ScanBarcode /> <span class="hidden sm:block">Inventory</span>
		</Button>
	</div>
	<div class="flex-grow justify-center gap-1 align-middle"></div>
	<div class="flex flex-row items-center justify-end">
		<Button href="/admin/sync" variant="outline" class="mx-1 my-1">
			<DatabaseZap class="h-4 w-4" /> Sync
		</Button>
		<Button variant="outline" class="mx-1 my-1 ml-1">
			<Users class="h-4 w-4" />
			<span class="text-sm">Users</span>
		</Button>
		<Button variant="outline" class="mx-1 my-1">
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
