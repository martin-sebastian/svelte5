<script lang="ts">
	export let vehicle: Vehicle;
</script>

<div class="group relative flex flex-col rounded-lg border p-4 hover:shadow-lg">
	<!-- Simplified card content -->
	<div class="relative aspect-video w-full overflow-hidden rounded-md bg-gray-200">
		{#if vehicle.primaryImage}
			<img
				src={vehicle.primaryImage}
				alt={vehicle.title || 'Vehicle'}
				class="h-full w-full object-cover"
				loading="lazy"
			/>
		{/if}
	</div>
	<div class="mt-4">
		<h3 class="text-lg font-semibold">{vehicle.title || 'Untitled Vehicle'}</h3>
		<p class="text-sm text-gray-600">{vehicle.stockNumber || 'No Stock Number'}</p>
	</div>
</div>
