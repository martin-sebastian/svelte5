<script lang="ts">
	import type { PageData } from './$types';
	import { KeyTag } from '$lib/components/keytag';
	import { setVehicleData } from '$lib/stores/keyTagState.svelte';
	import type { Vehicle } from '$lib/types/vehicle';

	export let data: PageData;

	// Set vehicle data when it exists
	$: if (data?.vehicle) {
		setVehicleData(data.vehicle as any);
	}
</script>

<div class="flex h-screen w-full items-center justify-center overflow-hidden">
	{#if data?.vehicle}
		<!-- Let KeyTag component handle everything -->
		<div class="h-[3in] w-[3in]">
			<KeyTag vehicleId={String(data.vehicle.id)} />
		</div>
	{:else}
		<div class="h-[3in] w-[3in]">
			<div class="text-center">
				<h2 class="text-xl font-semibold">Vehicle not found</h2>
				<p class="mt-2 text-gray-600">The requested vehicle could not be loaded.</p>
			</div>
		</div>
	{/if}
</div>
