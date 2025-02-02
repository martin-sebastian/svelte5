<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ShieldPlus, Loader2, User, Camera, Phone } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	const { data } = $page;
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	let firstName = $state('');
	let lastName = $state('');
	let phone = $state('');

	$effect(() => {
		firstName = data.user?.user_metadata?.first_name ?? '';
		lastName = data.user?.user_metadata?.last_name ?? '';
		phone = data.user?.user_metadata?.phone ?? '';
	});

	function handleSubmit() {
		loading = true;
		error = '';
		success = false;
		return async ({ result }: { result: ActionResult }) => {
			loading = false;

			if (result.type === 'failure') {
				error = result.data?.error || 'An error occurred';
			} else if (result.type === 'success') {
				success = true;
			} else if (result.type === 'redirect') {
				goto(result.location);
			}
		};
	}
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div
		class="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-gray-600/25 bg-gray-100/10 p-10 shadow-md sm:w-[350px] lg:w-1/2"
	>
		{#if data.user}
			<div class="relative">
				<div class="relative mb-4">
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-gray-500"
					>
						{#if data.user.user_metadata?.avatar_url}
							<img
								src={data.user.user_metadata.avatar_url}
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
							<Loader2 class="mr-2 inline h-4 w-4 animate-spin" />
						{/if}
						Update Profile
					</button>
				</div>
			</form>

			<form action="?/signout" method="POST" use:enhance={handleSubmit} class="mt-4 w-full">
				<button
					type="submit"
					class="w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
				>
					Sign Out
				</button>
			</form>
		{:else}
			<a href="/" aria-label="Home">
				<div class="mb-10 flex flex-row items-center">
					<ShieldPlus class="mx-1 h-12 w-12 text-gray-500" />
					<div class="text-xl font-bold">
						<span class="font-bold text-gray-500">DEALER</span><span
							class="font-black text-gray-500">OPS</span
						>
					</div>
				</div>
			</a>
			<h1 class="mb-1 text-2xl font-bold">Dealership Sign In</h1>
			<p class="mb-6 text-center text-sm text-gray-500">For dealerships users.</p>

			{#if error}
				<div class="mb-4 rounded-md bg-red-500/10 p-3 text-red-500">
					{error}
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance={handleSubmit} class="w-full space-y-4">
				<input type="hidden" name="redirectTo" value={data.redirectTo} />
				<div class="space-y-1">
					<label class="sr-only" for="email"> Email </label>
					<input
						id="email"
						name="email"
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
						type="email"
						placeholder="example@email.com"
						required
					/>
				</div>
				<div class="space-y-1">
					<label class="sr-only" for="password"> Password </label>
					<input
						id="password"
						name="password"
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
						type="password"
						placeholder="********"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
				>
					{#if loading}
						<Loader2 class="mr-2 inline h-4 w-4 animate-spin" />
					{/if}
					Login
				</button>
			</form>
			<p class="mt-6 text-center text-sm text-gray-500">
				Don't have an account?
				<a href="/auth/register" class="text-blue-500 hover:text-blue-600">Sign up</a>
			</p>
		{/if}
	</div>
</div>
