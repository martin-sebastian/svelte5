<script lang="ts">
	import type { PageData } from './$types';
	import { KeyTag } from '$lib/components/keytag';
	import { setVehicleData } from '$lib/stores/keyTagState.svelte';
	import type { Vehicle } from '$lib/types/vehicle';
	import { writable } from 'svelte/store';

	export let data: PageData;

	// Debug log store
	const logs = writable<string[]>([]);
	const showTerminal = writable(false);

	// Helper function to add logs with timestamps
	function addLog(message: string) {
		const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
		const logMessage = `[${timestamp}] ${message}`;
		console.log(logMessage);

		logs.update((currentLogs) => {
			// Keep only the last 100 logs to prevent memory issues
			if (currentLogs.length >= 100) {
				currentLogs.shift(); // Remove oldest log
			}
			return [...currentLogs, logMessage];
		});
	}

	// Toggle terminal visibility
	function toggleTerminal() {
		showTerminal.update((value) => !value);
	}

	// Debug log
	$: {
		if (data) {
			addLog('Page Data received');
			if (data.vehicle) {
				addLog(`Vehicle ID: ${data.vehicle.id}`);
				addLog(
					`Vehicle: ${data.vehicle.year} ${data.vehicle.manufacturer} ${data.vehicle.modelName}`
				);
				addLog(`Stock #: ${data.vehicle.stockNumber}`);
				addLog(`VIN: ${data.vehicle.vin}`);
			} else {
				addLog('No vehicle data found');
			}
		}
	}

	// Set vehicle data when it exists
	$: if (data?.vehicle) {
		addLog('Setting vehicle data to KeyTag component');
		setVehicleData(data.vehicle as any);
	}
</script>

{#if data?.vehicle}
	<!-- Let KeyTag component handle everything -->
	<div class="container mx-auto p-4">
		<KeyTag vehicleId={String(data.vehicle.id)} />

		<!-- Terminal toggle button -->
		<div class="mt-8 flex justify-center">
			<button
				class="flex items-center justify-center rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
				on:click={toggleTerminal}
			>
				{$showTerminal ? 'Hide' : 'Show'} Debug Terminal
			</button>
		</div>

		<!-- Terminal output -->
		{#if $showTerminal && $logs.length > 0}
			<div
				class="mt-4 max-h-80 overflow-auto rounded-md bg-black p-4 font-mono text-xs text-green-400"
			>
				{#each $logs as log}
					<div class="whitespace-pre-wrap">{log}</div>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-semibold">Vehicle not found</h2>
			<p class="mt-2 text-gray-600">The requested vehicle could not be loaded.</p>

			<!-- Terminal toggle button -->
			<div class="mt-8">
				<button
					class="flex items-center justify-center rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
					on:click={toggleTerminal}
				>
					{$showTerminal ? 'Hide' : 'Show'} Debug Terminal
				</button>
			</div>

			<!-- Terminal output -->
			{#if $showTerminal && $logs.length > 0}
				<div
					class="mt-4 max-h-80 overflow-auto rounded-md bg-black p-4 font-mono text-xs text-green-400"
				>
					{#each $logs as log}
						<div class="whitespace-pre-wrap">{log}</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
