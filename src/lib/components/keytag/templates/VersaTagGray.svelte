<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { CircleGauge, Car, Check, BadgeCheck } from 'lucide-svelte';
	import { vehicle } from '$lib/stores/keyTagState.svelte';
	import { versaTagGray } from '../assets';

	// Add metadata for the template selector
	export const name = 'Versa Tag Gray';
	export const width = '1.22in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Gray Versa Tag for a professional look';
</script>

<div class="versa-tag-gray">
	<!-- NEW checkbox -->
	<div class="absolute left-[0.09in] top-[0.26in] flex">
		{#if $vehicle?.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" /> {$vehicle.usage}
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="absolute right-[0.09in] top-[0.27in]">
		{#if $vehicle?.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="absolute left-[0.0in] top-[0.61in] text-[11pt] font-bold">
		{$vehicle?.stockNumber || ''}
	</div>

	<!-- Year -->
	<div class="absolute left-[0.11in] top-[0.96in] text-[14pt] font-bold">
		{$vehicle?.year || ''}
	</div>

	<!-- Manufacturer -->
	<div class="absolute left-[0.11in] top-[1.292in] text-[10pt] font-bold">
		{$vehicle?.manufacturer || ''}
	</div>

	<!-- Model -->
	<div class="absolute left-[0.11in] top-[1.539in] text-[11pt] font-bold">
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div class="absolute left-[0.11in] top-[1.788in] text-[8pt] font-bold">
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div class="absolute left-[0.11in] top-[2.035in] text-[8pt] font-bold">
		{$vehicle?.color || ''}
	</div>

	<!-- Metrics -->
	<div
		class="absolute left-[0.11in] top-[2.25in] flex items-center gap-[0.05in] text-[10pt] font-bold"
	>
		<CircleGauge class="h-[0.15in] w-[0.15in]" />
		{$vehicle?.metricValue?.toString() || ''}
		{$vehicle?.metricType || ''}
	</div>

	<!-- VIN -->
	<div class="absolute left-[0.4in] top-[2.5in] text-[10pt]">
		{$vehicle?.vin || ''}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-gray) {
		position: relative;
		width: 1.22in;
		height: 3in;
		color: #000000 !important;
		background-color: #e0e0e0 !important;
		background-image: url('{versaTagGray}') !important;
		background-size: cover !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
		overflow: hidden;
		text-transform: uppercase;
		text-align: center;
		/* Debug outline */
		outline: 1px solid rgba(255, 0, 0, 0.2);
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-gray) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 1.5in !important;
			height: 3in !important;
			background-image: url('{versaTagGray}') !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.versa-tag-gray svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
