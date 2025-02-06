<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { Loader2, Mail, ShieldPlus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	let email = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let message = $state('');

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		try {
			isLoading = true;
			error = '';
			message = '';

			const { error: signInError } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
					shouldCreateUser: true,
					data: {
						redirectTo: '/admin' // Where to go after successful auth
					}
				}
			});

			if (signInError) throw signInError;

			// Redirect to confirm-email page
			goto('/auth/confirm-email');
		} catch (e) {
			console.error('Login error:', e);
			error = e instanceof Error ? e.message : 'An error occurred during login';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card class="w-[350px]">
		<CardHeader class="text-center">
			<div class="mb-4 flex justify-center">
				<ShieldPlus class="h-12 w-12 text-gray-500" />
			</div>
			<CardTitle class="text-2xl">Welcome Back</CardTitle>
			<CardDescription>Enter your email to receive a magic link</CardDescription>
		</CardHeader>
		<CardContent>
			<form on:submit={handleLogin} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<div class="relative">
						<Mail class="absolute left-3 top-3 h-4 w-4 text-gray-500" />
						<Input
							id="email"
							type="email"
							placeholder="name@company.com"
							bind:value={email}
							class="pl-10"
							disabled={isLoading}
						/>
					</div>
				</div>

				{#if error}
					<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
						{error}
					</div>
				{/if}

				{#if message}
					<div class="rounded-md bg-green-500/15 p-3 text-sm text-green-500">
						{message}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Sending Link
					{:else}
						Send Magic Link
					{/if}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
