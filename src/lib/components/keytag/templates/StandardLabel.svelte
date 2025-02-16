<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { CircleGauge, Check } from 'lucide-svelte';

	const { vehicle } = $props<{ vehicle: Vehicle }>();
</script>

<div class="standard-label">
	<!-- NEW checkbox -->
	<div class="flex flex-row items-center justify-center text-center text-[12pt] font-black">
		{#if vehicle.usage?.toLowerCase() === 'new'}
			<Check class="ml-[-0.25in] h-5 w-5" /> {vehicle.usage}
		{/if}
	</div>

	<!-- USED checkbox -->
	<div
		class="flex flex-row items-center justify-center border-b text-center text-[12pt] font-black"
	>
		{#if vehicle.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" /> {vehicle.usage}
		{/if}
	</div>

	<!-- Stock Number -->
	<div
		class="my-1 flex flex-row items-center justify-center border-b text-center text-[11pt] font-black leading-none"
	>
		#{vehicle.stockNumber}
	</div>

	<!-- Year -->
	<div
		class="my-0 mt-[-2px] flex flex-row items-center justify-center border-b pb-0 text-center text-[18pt] font-black leading-none"
	>
		{vehicle.year}
	</div>

	<!-- Manufacturer -->
	<div
		class="my-1 flex flex-row items-center justify-center border-b text-center text-[8pt] font-black leading-none"
	>
		{vehicle.manufacturer}
	</div>

	<!-- Model -->
	<div
		class="my-1 flex flex-row items-center justify-center border-b text-center text-[8pt] font-black leading-none"
	>
		{vehicle.modelName}
	</div>

	<!-- Model Type/BODY -->
	<div
		class="my-1 flex flex-row items-center justify-center border-b pb-1 text-center text-[8pt] font-black leading-none"
	>
		{vehicle.modelType}
	</div>

	<!-- Color -->
	<div
		class="mt-[-2px] flex flex-row items-center justify-center border-b text-center text-[10pt] font-black leading-none"
	>
		{vehicle.color}
	</div>

	<!-- Metrics -->
	<div
		class="my-1 flex flex-row items-center justify-center border-b text-center text-[10pt] font-black leading-none"
	>
		<CircleGauge class="mr-1 h-[0.15in] w-[0.15in]" />
		{vehicle.metricValue?.toString() || ''}
		{vehicle.metricType}
	</div>

	<!-- VIN -->
	<div
		class="my-1 flex flex-row items-center justify-center text-center text-[8pt] font-light leading-none"
	>
		{vehicle.vin}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.standard-label) {
		position: relative;
		width: 1.25in;
		height: 3in;
		color: #000000 !important;
		background: #ffffff !important;
		overflow: hidden;
		text-transform: uppercase;
		text-align: center;
		border-radius: 5px;
		background-color: auto;
		border: 1px solid #000000;
		/* Debug outline */
		/* outline: 1px solid rgba(255, 0, 0, 0.2); */
	}

	/* Print-specific styles */
	@media print {
		:global(.standard-label) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 1.5in !important;
			height: 3in !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.standard-label svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
