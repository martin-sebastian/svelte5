<script lang="ts">
	import type { PageData } from './$types';
	import { KeyTag } from '$lib/components/keytag';
	import { setVehicleData } from '$lib/stores/keyTagState.svelte';

	export let data: PageData;

	// Set vehicle data when it exists
	$: if (data?.vehicle) {
		setVehicleData(data.vehicle as any);
	}
</script>

<div class="flex h-screen w-full flex-col overflow-hidden">
	{#if data?.vehicle}
		<!-- Let KeyTag component handle everything -->
		<KeyTag vehicleId={String(data.vehicle.id)} />
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<div class="text-center">
				<h2 class="text-xl font-semibold">Vehicle not found</h2>
				<p class="mt-2 text-gray-600">The requested vehicle could not be loaded.</p>
			</div>
		</div>
	{/if}
</div>
