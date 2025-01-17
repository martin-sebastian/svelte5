<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();

	let isLoading = $state(false);
	let importMessage = $state('');

	async function handleImport() {
		console.log('Starting import...');
		try {
			isLoading = true;
			const response = await fetch('/admin/sync');
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
	<h1 class="text-4xl font-bold">Integrations</h1>
	<h2 class="text-2xl font-bold text-muted-foreground">Dealer Spike Inventory Sync</h2>
	<button
		class="my-10 flex flex-row items-center gap-2 rounded-lg bg-slate-900 px-4 py-5 text-white hover:bg-slate-800 disabled:opacity-50"
		onclick={handleImport}
		disabled={isLoading}
	>
		{#if isLoading}
			Importing...
		{:else}
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-database-zap"
			>
				<ellipse cx="12" cy="5" rx="9" ry="3" />
				<path d="M3 5V19A9 3 0 0 0 15 21.84" />
				<path d="M21 5V8" />
				<path d="M21 12L18 17H22L19 22" />
				<path d="M3 12A9 3 0 0 0 14.59 14.87" />
			</svg>
			Sync Inventory with Dealer Spike
		{/if}
	</button>

	{#if importMessage}
		<p class={importMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
			{importMessage}
		</p>
	{/if}
</div>
