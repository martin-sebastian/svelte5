<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let { data } = $props();

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error.message);
		} else {
			await goto('/admin/auth/login');
		}
	}
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<Avatar.Root class="h-[128px] w-[128px]">
		<Avatar.Image src="https://martinsebastian.co/avatar/martin.png" alt="Profile" />
		<Avatar.Fallback>MS</Avatar.Fallback>
	</Avatar.Root>
	{#if data.user}
		<h1 class="my-5 text-7xl font-bold">Hi {data.user.email}!</h1>
		<p class="my-2 text-lg font-bold">
			User ID: {data.user.id}
		</p>
		<p class="my-2 text-lg">
			Last Sign In: {new Date(data.user.last_sign_in_at).toLocaleString()}
		</p>
	{/if}
	<div class="my-5 flex flex-row gap-2">
		<Button href="/admin/vehicles">Dashboard</Button>
		<Button on:click={signOut}>Logout</Button>
	</div>
</div>
