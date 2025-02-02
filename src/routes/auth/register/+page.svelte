<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { ShieldPlus, Loader2, Mail, Lock, User, ArrowLeft } from 'lucide-svelte';

	const { data } = $page;
	let loading = $state(false);
	let error = $state('');

	// Form data
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let firstName = $state('');
	let lastName = $state('');

	// Password validation
	function getPasswordStrength(pwd: string) {
		if (!pwd) return '';
		if (pwd.length < 8) return 'Too short';
		if (!/[A-Z]/.test(pwd)) return 'Need uppercase';
		if (!/[a-z]/.test(pwd)) return 'Need lowercase';
		if (!/[0-9]/.test(pwd)) return 'Need number';
		return 'Strong';
	}

	let passwordStrength = $derived(getPasswordStrength(password));

	let passwordsMatch = $derived(password === confirmPassword || !confirmPassword);

	function handleSubmit() {
		if (!passwordsMatch) {
			error = 'Passwords do not match';
			return;
		}
		if (passwordStrength !== 'Strong') {
			error = 'Password is not strong enough';
			return;
		}

		loading = true;
		error = '';
		return async ({ result }) => {
			loading = false;
			if (result.type === 'error') {
				error = result.error.message;
			} else if (result.type === 'redirect') {
				window.location.href = result.location;
			}
		};
	}
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div
		class="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-gray-600/25 bg-gray-100/10 p-10 shadow-md"
	>
		<a
			href="/auth"
			class="mb-6 flex items-center gap-2 self-start text-sm text-gray-500 hover:text-gray-700"
		>
			<ArrowLeft class="h-4 w-4" />
			Back to Login
		</a>

		<a href="/" aria-label="Home">
			<div class="mb-10 flex flex-row items-center">
				<ShieldPlus class="mx-1 h-12 w-12 text-gray-500" />
				<div class="text-xl font-bold">
					<span class="font-bold text-gray-500">DEALER</span><span class="font-black text-gray-500"
						>OPS</span
					>
				</div>
			</div>
		</a>
		<h1 class="mb-1 text-2xl font-bold">Create Account</h1>
		<p class="mb-6 text-center text-sm text-gray-500">For dealerships users.</p>

		{#if error}
			<div class="mb-4 w-full rounded-md bg-red-500/10 p-3 text-red-500">
				{error}
			</div>
		{/if}

		<form method="POST" action="?/register" use:enhance={handleSubmit} class="w-full space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-1">
					<label class="text-sm font-medium" for="firstName">First Name</label>
					<input
						id="firstName"
						name="firstName"
						bind:value={firstName}
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
						type="text"
						required
					/>
				</div>

				<div class="space-y-1">
					<label class="text-sm font-medium" for="lastName">Last Name</label>
					<input
						id="lastName"
						name="lastName"
						bind:value={lastName}
						class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
						type="text"
						required
					/>
				</div>
			</div>

			<div class="space-y-1">
				<label class="text-sm font-medium" for="email">
					<div class="flex items-center gap-2">
						<Mail class="h-4 w-4" />
						Email
					</div>
				</label>
				<input
					id="email"
					name="email"
					bind:value={email}
					class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
					type="email"
					required
				/>
			</div>

			<div class="space-y-1">
				<label class="text-sm font-medium" for="password">
					<div class="flex items-center gap-2">
						<Lock class="h-4 w-4" />
						Password
					</div>
				</label>
				<input
					id="password"
					name="password"
					bind:value={password}
					class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
					type="password"
					required
					minlength="8"
				/>
				{#if password}
					<p
						class="mt-1 text-sm"
						class:text-red-500={passwordStrength !== 'Strong'}
						class:text-green-500={passwordStrength === 'Strong'}
					>
						{passwordStrength}
					</p>
				{/if}
			</div>

			<div class="space-y-1">
				<label class="text-sm font-medium" for="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					bind:value={confirmPassword}
					class="w-full rounded-md border border-gray-600/25 bg-white/10 p-2 text-black"
					type="password"
					required
				/>
				{#if confirmPassword && !passwordsMatch}
					<p class="mt-1 text-sm text-red-500">Passwords do not match</p>
				{/if}
			</div>

			<button
				type="submit"
				disabled={loading || !passwordsMatch || passwordStrength !== 'Strong'}
				class="mt-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
			>
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Create Account
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-500">
			Already have an account?
			<a href="/auth" class="text-blue-500 hover:text-blue-600">Sign in</a>
		</p>
	</div>
</div>
