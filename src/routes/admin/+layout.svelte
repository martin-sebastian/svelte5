<script lang="ts">
	const { children } = $props();
	import { supabase } from '$lib/supabaseClient';
	import { Button } from '$lib/components/ui/button';
	import { DatabaseZap, Users, Settings, Sun, Moon, User, LogOut } from 'lucide-svelte';
	import { theme } from '$lib/stores/themeStore';

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
	<div class="flex flex-row items-center justify-end"></div>
	<div class="h-screen w-full">
		{@render children()}
	</div>
</div>
