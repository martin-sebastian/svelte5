<script lang="ts">
	const { children } = $props();
	import { supabase } from '$lib/supabase';
	import { Button } from '$lib/components/ui/button';
	import { ShieldPlus, LogOut, Settings, DatabaseZap, User } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	async function handleLogout() {
		try {
			await supabase.auth.signOut();
			window.location.href = '/';
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<div class="h-screen min-h-screen bg-background">
	<nav
		class="fixed z-[60] flex h-12 w-full justify-between border-b border-gray-500/25 bg-background/50 shadow-sm backdrop-blur-md"
	>
		<div class="flex items-center">
			<a href="/admin" class="mx-4" aria-label="Home">
				<div class="flex items-center">
					<ShieldPlus class="h-8 w-8" />
					<div class="hidden sm:flex">
						<span class="font-bold">DEALER</span><span class="font-black">OPS</span>
					</div>
				</div>
			</a>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="ghost" href="/admin/profile">
				<User class="mr-2 h-4 w-4" />
				Profile
			</Button>
			<Button variant="ghost" href="/admin/sync">
				<DatabaseZap />
				Sync
			</Button>
			<Button variant="ghost" href="/admin/settings">
				<Settings class="mr-2 h-4 w-4" />
				Settings
			</Button>
			<ThemeToggle />
			<Button variant="ghost" onclick={handleLogout}>
				<LogOut class="mr-2 h-4 w-4" />
				Logout
			</Button>
		</div>
	</nav>
	<div class="h-screen w-full">
		<div class="h-16 w-full"></div>
		{@render children()}
	</div>
</div>
