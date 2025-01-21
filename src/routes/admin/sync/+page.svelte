<script lang="ts">
	import type { PageServerData } from './$types';
	import { PackageX } from 'lucide-svelte';
	import { DatabaseZap } from 'lucide-svelte';
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

	async function handleTruncate(table: string) {
		if (!confirm(`Are you sure you want to truncate the ${table} table? This cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch('/admin/sync', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: `truncate${table}`
				})
			});

			const result = await response.json();
			if (result.success) {
				alert(result.message);
			} else {
				alert(`Failed to truncate ${table}: ${result.error}`);
			}
		} catch (error) {
			alert(`Error truncating ${table}`);
			console.error(error);
		}
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(price);
	}
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<h1 class="py-4 text-4xl font-bold">Integrations</h1>
	<div class="flex flex-col rounded-lg border border-slate-700/50 p-4">
		<h2 class="text-2xl font-bold text-muted-foreground">Dealer Spike Inventory Sync</h2>
		<button
			class="my-10 flex flex-row items-center gap-2 rounded-lg bg-orange-500 px-4 py-5 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
			onclick={handleImport}
			disabled={isLoading}
		>
			{#if isLoading}
				<svg
					class="h-5 w-5 animate-spin text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				Synchronizing Inventory Data...
			{:else}
				<DatabaseZap class="h-10 w-10" />
				Sync all Inventory Data with Dealer Spike
			{/if}
		</button>

		{#if importMessage}
			<p class={importMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}>
				{importMessage}
			</p>
		{/if}

		<div class="mt-4 flex flex-col gap-4">
			<button
				class="rounded bg-slate-600 px-4 py-2 text-start font-bold text-white hover:bg-red-700"
				onclick={() => handleTruncate('Attributes')}
			>
				<h5 class="flex flex-row items-center gap-2">
					<PackageX class="h-5 w-5" /> Step 1
				</h5>
				<span class="text-start text-sm text-muted-foreground">
					Delete all attributes from the database.
				</span>
			</button>
			<button
				class="rounded bg-slate-700 px-4 py-2 text-start font-bold text-white hover:bg-red-700"
				onclick={() => handleTruncate('Images')}
			>
				<h5 class="flex flex-row items-center gap-2">
					<PackageX class="h-5 w-5" /> Step 2
				</h5>
				<span class="text-start text-sm text-muted-foreground">
					Delete all images from the database.
				</span>
			</button>
			<button
				class="rounded bg-slate-800 px-4 py-2 text-start font-bold text-white hover:bg-red-700"
				onclick={() => handleTruncate('Vehicles')}
			>
				<h5 class="flex flex-row items-center gap-2">
					<PackageX class="h-5 w-5" /> Step 3
				</h5>
				<span class="text-start text-sm text-muted-foreground">
					Delete all vehicles from the database.
				</span>
			</button>
		</div>
	</div>
</div>
