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
	import { ShieldPlus } from 'lucide-svelte';

	let email = $state('');
	let loading = $state(false);
	let message = $state('');
	let error = $state('');

	async function handleLogin(e: Event) {
		e.preventDefault();
		try {
			loading = true;
			error = '';
			message = '';

			const { data, error: signInError } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					shouldCreateUser: true,
					data: {
						email,
						timestamp: new Date().toISOString()
					}
				}
			});

			if (signInError) throw signInError;

			message = 'Check your email for the login link!';
		} catch (e: any) {
			error = e.message || 'An error occurred';
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
			<form onsubmit={handleLogin} class="space-y-4">
				<Input type="email" placeholder="Email" bind:value={email} disabled={loading} required />
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<div
							class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Sending Magic Link...
					{:else}
						Send Magic Link
					{/if}
				</Button>
				{#if message}
					<p class="text-center text-sm text-green-600 dark:text-green-400">{message}</p>
				{/if}
				{#if error}
					<p class="text-center text-sm text-red-600 dark:text-red-400">{error}</p>
				{/if}
			</form>
		</CardContent>
	</Card>
</div>
