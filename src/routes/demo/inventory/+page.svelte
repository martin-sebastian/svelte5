<script lang="ts">
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	let { data }: { data: PageServerData } = $props();

	// Add loading state
	let isLoading = $state(false);
	let importMessage = $state('');

	// Function to handle import
	async function handleImport() {
		console.log('Starting import...');
		try {
			isLoading = true;
			const response = await fetch('/demo/inventory/import');
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
	<h1>Inventory Demo</h1>
	<p>User ID: {data.user.id}</p>
	<Button class="my-5 bg-red-500 hover:bg-red-700" on:click={handleImport} disabled={isLoading}>
		{#if isLoading}
			Importing...
		{:else}
			Import/Update Motorcycle Data
		{/if}
	</Button>

	{#if importMessage}
		<p class={importMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
			{importMessage}
		</p>
	{/if}
</div>
