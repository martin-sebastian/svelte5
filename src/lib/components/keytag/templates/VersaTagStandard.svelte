<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { CircleGauge, Car, Check, BadgeCheck } from 'lucide-svelte';

	const { vehicle } = $props<{ vehicle: Vehicle }>();
</script>

<div class="versa-tag-standard">
	<!-- NEW checkbox -->
	<div class="absolute left-[0.09in] top-[0.24in]">
		{#if vehicle.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="absolute left-[0.973in] top-[0.24in]">
		{#if vehicle.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="absolute left-[0.11in] top-[0.61in] line-clamp-2 text-[11pt] font-bold leading-none">
		#{vehicle.stockNumber}
	</div>

	<!-- Year -->
	<div class="absolute right-[0.01in] top-[0.99in] text-[10pt] font-bold">
		{vehicle.year}
	</div>

	<!-- Manufacturer -->
	<div class="absolute right-[0.01in] top-[1.265in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.manufacturer}
	</div>

	<!-- Model -->
	<div class="absolute left-[0.4in] top-[1.49in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.modelName}
	</div>

	<!-- Model Type/BODY -->
	<div class="absolute left-[0.39in] top-[1.775in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.modelType}
	</div>

	<!-- Color -->
	<div class="absolute right-[0.01in] top-[2.19in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.color}
	</div>

	<!-- Metrics -->
	<div
		class="absolute left-[0.1in] top-[2.25in] flex items-center gap-[0.05in] text-[10pt] font-bold"
	>
		<CircleGauge class="h-[0.15in] w-[0.15in]" />
		{vehicle.metricValue?.toString() || ''}
		{vehicle.metricType}
	</div>

	<!-- VIN -->
	<div class="absolute bottom-[0.19in] left-[0.01in] text-center text-[8pt]">
		VIN{vehicle.vin}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-standard) {
		position: relative;
		width: 1.22in;
		height: 3in;
		color: #000000 !important;
		border: 1px solid red;
		overflow: hidden;
		text-transform: uppercase;
		text-align: right;
		/* Debug outline */
		/* outline: 1px solid rgba(255, 0, 0, 0.2); */
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-standard) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 3in !important;
			height: 3in !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.versa-tag-standard svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
