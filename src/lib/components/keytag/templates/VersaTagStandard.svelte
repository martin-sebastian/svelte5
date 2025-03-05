<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { CircleGauge, Car, Check, BadgeCheck } from 'lucide-svelte';
	import { vehicle as vehicleStore } from '$lib/stores/keyTagState.svelte';
	import { versaTagStandard } from '../assets';

	// Use type assertion to avoid TypeScript errors
	const vehicle = vehicleStore as unknown as import('svelte/store').Readable<{
		usage?: string;
		stockNumber?: string;
		year?: number | string;
		manufacturer?: string;
		modelName?: string;
		modelType?: string;
		color?: string;
		metricValue?: number | string;
		metricType?: string;
		vin?: string;
		[key: string]: any;
	}>;

	// Create background style variables
	const backgroundImageStyle = `background-image: url('${versaTagStandard}') !important;`;

	// Add metadata for the template selector
	export const name = 'Versa Tag Standard';
	export const width = '1.22in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Standard Versa Tag with white background';
</script>

<div class="versa-tag-standard" style={backgroundImageStyle}>
	<!-- NEW checkbox -->
	<div class="absolute left-[0.09in] top-[0.26in]">
		{#if $vehicle?.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="absolute left-[0.973in] top-[0.26in]">
		{#if $vehicle?.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="absolute left-[0.11in] top-[0.61in] text-[11pt] font-bold">
		#{$vehicle?.stockNumber || ''}
	</div>

	<!-- Year -->
	<div class="absolute right-[0.0in] top-[0.994in] text-[10pt]">
		{$vehicle?.year || ''}
	</div>

	<!-- Manufacturer -->
	<div class="absolute right-[0.01in] top-[1.292in] text-[8pt] font-bold">
		{$vehicle?.manufacturer || ''}
	</div>

	<!-- Model -->
	<div class="absolute left-[0.4in] top-[1.539in] text-[8pt] font-bold">
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div class="absolute left-[0.39in] top-[1.788in] text-[8pt] font-bold">
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div class="absolute right-[0.0in] top-[2.035in] text-[8pt] font-bold">
		{$vehicle?.color || ''}
	</div>

	<!-- Metrics -->
	<div
		class="absolute left-[0.01in] top-[2.25in] flex w-[1.22in] flex-row items-center justify-center gap-[0.05in] text-[8pt] font-bold"
	>
		<CircleGauge class="h-[0.15in] w-[0.15in]" />
		{$vehicle?.metricValue?.toString() || ''}
		{$vehicle?.metricType || ''}
	</div>

	<!-- VIN -->
	<div class="absolute bottom-[0.0in] left-[0.01in] w-[1.22in] text-left text-[8pt]">
		{$vehicle?.vin || ''}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-standard) {
		position: relative;
		width: 1.22in;
		height: 3in;
		color: #000000 !important;
		background-color: #ffffff !important;
		background-size: cover !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
		overflow: hidden;
		text-transform: uppercase;
		text-align: left;
		/* Debug outline */
		outline: 1px solid rgba(255, 0, 0, 0.2);
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-standard) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 1.5in !important;
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
