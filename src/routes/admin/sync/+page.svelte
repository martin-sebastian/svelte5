<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();

	let isLoading = $state(false);
	let importMessage = $state('');

	async function handleImport() {
		try {
			isLoading = true;
			const response = await fetch('/admin/sync');
			const result = await response.json();

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

	async function handleDelete(table: 'vehicle' | 'vehicle_image' | 'vehicle_attribute') {
		if (!confirm(`Are you sure you want to delete all data from ${table}?`)) {
			return;
		}

		try {
			isLoading = true;
			const response = await fetch('/admin/sync', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ table })
			});
			const result = await response.json();

			if (result.success) {
				importMessage = result.message;
			} else {
				importMessage = `Error: ${result.error}`;
			}
		} catch (error) {
			console.error('Delete error:', error);
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

	<div class="mt-8 flex flex-col gap-4">
		<button
			class="flex flex-row items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
			onclick={() => handleDelete('vehicle')}
			disabled={isLoading}
		>
			Delete All Vehicles
		</button>

		<button
			class="flex flex-row items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
			onclick={() => handleDelete('vehicle_image')}
			disabled={isLoading}
		>
			Delete All Vehicle Images
		</button>

		<button
			class="flex flex-row items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
			onclick={() => handleDelete('vehicle_attribute')}
			disabled={isLoading}
		>
			Delete All Vehicle Attributes
		</button>
	</div>

	{#if importMessage}
		<p class={importMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
			{importMessage}
		</p>
	{/if}
</div>
