<script lang="ts">
	import type { PageData } from './$types';
	import { KeyTag } from '$lib/components/keytag';
	import { setVehicleData } from '$lib/stores/keyTagState';

	const { data } = $props<{ data: PageData }>();

	// Debug log
	$effect(() => {
		console.log('Page Data:', data);
	});

	// Only set vehicle data when it exists
	$effect(() => {
		if (data?.vehicle) {
			console.log('Setting vehicle data:', data.vehicle);
			// Pass the vehicle data directly, letting the component handle typing
			setVehicleData(data.vehicle as any);
		}
	});
</script>

{#if data?.vehicle}
	<!-- Let KeyTag component handle everything -->
	<div class="container mx-auto p-4">
		<KeyTag vehicleId={String(data.vehicle.id)} />
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-semibold">Vehicle not found</h2>
			<p class="mt-2 text-gray-600">The requested vehicle could not be loaded.</p>
		</div>
	</div>
{/if}
