<script lang="ts">
	import { page } from '$app/stores';
	import { ShieldCheck, Loader2, User, Camera, Phone } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import type { User as SupabaseUser } from '@supabase/supabase-js';

	const { data } = $page;
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	// Get user's metadata
	$effect(() => {
		if (data.session?.user) {
			// Verify user data
			data.supabase.auth
				.getUser()
				.then(
					({
						data: { user },
						error
					}: {
						data: { user: SupabaseUser | null };
						error: Error | null;
					}) => {
						if (!error && user) {
							firstName = user.user_metadata?.first_name || '';
							lastName = user.user_metadata?.last_name || '';
							phone = user.user_metadata?.phone || '';
						}
					}
				);
		}
	});

	let firstName = $state('');
	let lastName = $state('');
	let phone = $state('');

	function handleSubmit() {
		loading = true;
		error = '';
		success = false;
		return async ({ result }: { result: ActionResult }) => {
			loading = false;

			if (result.type === 'error') {
				error = result.error.message;
			} else if (result.type === 'success') {
				success = true;
			} else if (result.type === 'redirect') {
				// Force a full page reload on redirect
				window.location.href = result.location;
			}
		};
	}
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div
		class="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-gray-600/25 bg-gray-100/10 p-10 shadow-md"
	>
		{#if data.session}
			<div class="relative">
				<div class="relative mb-4">
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-gray-500"
					>
						{#if data.session.user.user_metadata?.avatar_url}
							<img
								src={data.session.user.user_metadata.avatar_url}
								alt="Profile"
								class="h-24 w-24 rounded-full object-cover"
							/>
						{:else}
							<User class="h-12 w-12" />
						{/if}
					</div>
					<button
						class="absolute bottom-0 right-0 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
						title="Change avatar"
					>
						<Camera class="h-4 w-4" />
					</button>
				</div>
			</div>

			<h1 class="mb-6 text-2xl font-bold">Profile Settings</h1>

			{#if error}
				<div class="mb-4 w-full rounded-md bg-red-500/10 p-3 text-red-500">
					{error}
				</div>
			{/if}

			{#if success}
				<div class="mb-4 w-full rounded-md bg-green-500/10 p-3 text-green-500">
					Profile updated successfully!
				</div>
			{/if}

			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={handleSubmit}
				class="w-full space-y-4"
			>
				<div class="space-y-1">
					<label class="text-sm font-medium" for="firstName"> First Name </label>
					<input
						id="firstName"
						name="firstName"
						bind:value={firstName}
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black dark:text-white"
						type="text"
					/>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium" for="lastName"> Last Name </label>
					<input
						id="lastName"
						name="lastName"
						bind:value={lastName}
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black dark:text-white"
						type="text"
					/>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium" for="phone">
						<div class="flex items-center gap-2">
							<Phone class="h-4 w-4" />
							Phone Number
						</div>
					</label>
					<input
						id="phone"
						name="phone"
						bind:value={phone}
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black dark:text-white"
						type="tel"
						placeholder="(555) 555-5555"
					/>
				</div>

				<div class="flex w-full flex-col gap-4">
					<button
						type="submit"
						disabled={loading}
						class="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
					>
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Update Profile
					</button>
				</div>
			</form>

			<form action="?/signout" method="POST" use:enhance class="mt-4 w-full">
				<button
					type="submit"
					class="w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
				>
					Sign Out
				</button>
			</form>
		{:else}
			<ShieldCheck class="my-0 h-10 w-10" />
			<h1 class="my-5 text-2xl font-bold">Sign In</h1>

			{#if error}
				<div class="mb-4 rounded-md bg-red-500/10 p-3 text-red-500">
					{error}
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance={handleSubmit} class="w-full space-y-4">
				<input type="hidden" name="redirectTo" value={data.redirectTo} />
				<div class="space-y-1">
					<label class="text-sm font-medium" for="email"> Email </label>
					<input
						id="email"
						name="email"
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black dark:text-white"
						type="email"
						required
					/>
				</div>
				<div class="space-y-1">
					<label class="text-sm font-medium" for="password"> Password </label>
					<input
						id="password"
						name="password"
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black dark:text-white"
						type="password"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
				>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Login
				</button>
			</form>
		{/if}
	</div>
</div>
