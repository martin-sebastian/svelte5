<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';
	let { data }: { data: PageServerData } = $props();

	let isLoading = $state(false);
	let importMessage = $state('');

	$effect(() => {
		if (!data.user) {
			goto('/demo/lucia/login');
		}
	});

	async function handleImport() {
		console.log('Starting import...');
		try {
			isLoading = true;
			const response = await fetch('/demo/inventory');

			// Handle unauthorized responses
			if (response.status === 401) {
				// Redirect to login page if unauthorized
				goto('/demo/lucia/login');
				return;
			}

			const result = await response.json();
			console.log('Import result:', result);

			if (result.success) {
				importMessage = result.message;
			} else {
				importMessage = `Error: ${result.error}`;
			}
		} catch (error) {
			console.error('Import error:', error);
			importMessage = `Error: ${error.message}`;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	{#if data.user}
		<h1>Inventory Demo</h1>
		<p>User ID: {data.user.id}</p>
		<button
			class="my-5 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
			onclick={handleImport}
			disabled={isLoading}
		>
			{#if isLoading}
				Importing...
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-database-zap"
					><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 15 21.84" /><path
						d="M21 5V8"
					/><path d="M21 12L18 17H22L19 22" /><path d="M3 12A9 3 0 0 0 14.59 14.87" /></svg
				>Sync Inventory with Dealer Spike
			{/if}
		</button>

		{#if importMessage}
			<p class={importMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
				{importMessage}
			</p>
		{/if}
	{/if}
</div>
