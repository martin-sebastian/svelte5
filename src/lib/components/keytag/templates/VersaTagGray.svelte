<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { CircleGauge, Car, Check } from 'lucide-svelte';

	const { vehicle } = $props<{ vehicle: Vehicle }>();
</script>

<div class="versa-tag-gray">
	<!-- NEW checkbox -->
	<div class="absolute left-[0.09in] top-[0.26in]">
		{#if vehicle.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="absolute right-[0.09in] top-[0.26in]">
		{#if vehicle.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="absolute left-[0.11in] top-[0.61in] line-clamp-2 text-[11pt] font-bold leading-none">
		#{vehicle.stockNumber}
	</div>

	<!-- Year -->
	<div class="absolute left-[0.11in] top-[0.994in] text-[10pt] font-bold">
		{vehicle.year}
	</div>

	<!-- Manufacturer -->
	<div class="absolute left-[0.11in] top-[1.292in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.manufacturer}
	</div>

	<!-- Model -->
	<div class="absolute left-[0.11in] top-[1.539in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.modelName}
	</div>

	<!-- Model Type/BODY -->
	<div class="absolute left-[0.11in] top-[1.788in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.modelType}
	</div>

	<!-- Color -->
	<div class="absolute left-[0.11in] top-[2.035in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.color}
	</div>

	<!-- Metrics -->
	<div
		class="absolute left-[0.11in] top-[2.25in] flex items-center gap-[0.05in] text-[8pt] font-bold"
	>
		<CircleGauge class="h-[0.15in] w-[0.15in]" />
		{vehicle.metricValue?.toString() || ''}
		{vehicle.metricType}
	</div>

	<!-- VIN -->
	<div class="absolute bottom-[0.4in] left-[0.11in] line-clamp-2 text-[8pt] leading-none">
		{vehicle.vin}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-gray) {
		position: relative;
		width: 3in;
		height: 3in;
		color: #000000 !important;
		overflow: hidden;
		text-transform: uppercase;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-gray) {
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 3in !important;
			height: 3in !important;
		}

		:global(.versa-tag-gray svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
