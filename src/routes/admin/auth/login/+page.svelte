<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { invalidateAll } from '$app/navigation';
	
	let errorMessage = '';
	let loading = false;
	
	async function signInWithEmail(event: SubmitEvent) {
		loading = true;
		errorMessage = '';
		
		try {
			const formData = new FormData(event.target as HTMLFormElement);
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			
			console.log('%c=== Login Attempt ===', 'color: blue; font-weight: bold');
			console.log('Email:', email);
			
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			
			if (error) {
				console.error('%cLogin Error:', 'color: red; font-weight: bold', error.message);
				errorMessage = error.message;
			} else {
				console.log('%cLogin Successful!', 'color: green; font-weight: bold');
				console.log('Session:', data.session);
				console.log('User:', data.user);
				
				// Wait a moment before redirecting
				await new Promise(resolve => setTimeout(resolve, 500));
				await invalidateAll();
				
				// Use window.location for a full page reload
				window.location.href = '/admin/auth';
			}
		} catch (error) {
			console.error('%cUnexpected Error:', 'color: red; font-weight: bold', error);
			errorMessage = 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<div class="w-96 rounded-xl border border-gray-500/50 bg-slate-900/50 p-5 shadow-lg">
		<h1 class="my-5 text-2xl font-bold text-center">Login</h1>
		{#if errorMessage}
			<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md mb-4">
				{errorMessage}
			</div>
		{/if}
		<form on:submit|preventDefault={signInWithEmail}>
			<input
				name="email"
				type="email"
				placeholder="Email"
				class="my-1 w-full rounded-md border p-2 text-black"
				disabled={loading}
			/>
			<input
				name="password"
				type="password"
				placeholder="Password"
				class="my-1 w-full rounded-md border p-2 text-black"
				disabled={loading}
			/>
			<button 
				type="submit" 
				class="my-1 w-full rounded-md bg-blue-500 p-2 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>
