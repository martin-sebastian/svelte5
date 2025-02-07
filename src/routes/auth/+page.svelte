<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { ShieldPlus, Loader2 } from 'lucide-svelte';

	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let message = $state('');

	async function handleLogin() {
		try {
			loading = true;
			error = '';
			message = '';

			const { error: signInError } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (signInError) throw signInError;

			message = 'Check your email for the login link!';
			email = '';
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card class="w-[350px]">
		<CardHeader>
			<div class="flex justify-center">
				<ShieldPlus class="h-12 w-12" />
			</div>
			<CardTitle class="text-center text-2xl font-bold">Welcome Back</CardTitle>
			<CardDescription class="text-center">
				Enter your email to receive a magic link
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<Input type="email" placeholder="Email" bind:value={email} disabled={loading} required />
				<Button class="w-full" disabled={loading} onclick={handleLogin}>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Sending magic link...
					{:else}
						Send magic link
					{/if}
				</Button>
			</div>
			{#if message}
				<p class="mt-4 text-center text-sm text-green-600 dark:text-green-400">{message}</p>
			{/if}
			{#if error}
				<p class="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
			{/if}
		</CardContent>
	</Card>
</div>
