<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { Check } from 'lucide-svelte';
	import { vehicle as vehicleStore } from '$lib/stores/keyTagState.svelte';
	import { versaTagGray } from '../assets';

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
	const backgroundImageStyle = `background-image: url('${versaTagGray}') !important;`;

	// Add metadata for the template selector
	export const name = 'Versa Tag Gray';
	export const width = '3in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Gray Versa Tag for a professional look';
</script>

<div class="versa-tag-gray" style={backgroundImageStyle}>
	<!-- NEW checkbox -->
	<div class="new absolute">
		{#if $vehicle?.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="used relative">
		{#if $vehicle?.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="stock-number relative">
		{$vehicle?.stockNumber || ''}
	</div>

	<!-- Year -->
	<div class="year relative">
		{$vehicle?.year || ''}
	</div>

	<!-- Manufacturer -->
	<div class="manufacturer relative">
		{$vehicle?.manufacturer || ''}
	</div>

	<!-- Model -->
	<div class="model relative">
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div class="model-type relative">
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div class="color relative">
		{$vehicle?.color || ''}
	</div>

	<!-- Metrics -->
	<div class="usage-value relative">
		{$vehicle?.metricValue?.toString() || ''}
	</div>
	<div class="usage-type relative">
		{$vehicle?.metricType || ''}
	</div>

	<!-- VIN -->
	<div class="vin relative">
		{$vehicle?.vin || ''}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-gray) {
		position: relative;
		width: 3in;
		height: 3in;
		font-weight: 900;
		color: #000000 !important;
		background-color: #e0e0e0 !important;
		background-size: cover !important;
		background-position: left !important;
		background-repeat: no-repeat !important;
		overflow: hidden;
		text-transform: uppercase;
		text-align: left;
		/* Debug outline */
		outline: 1px solid rgba(255, 0, 0, 0.2);
	}
	.new {
		position: absolute;
		top: 0.26in;
		left: 0.09in;
	}
	.used {
		position: absolute;
		top: 0.26in;
		left: 0.19in;
	}

	.stock-number {
		font-size: 14pt;
		width: 1.22in;
		top: 0.58in;
		left: 0.05in;
		text-align: left;
		font-weight: 900;
		letter-spacing: -1px;
		line-height: 1.2;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 2px 2px;
		background-color: #c0c0c0;
	}
	.year {
		font-size: 16pt;
		width: 1.2in;
		top: 0.5in;
		left: 0.05in;
		font-weight: 900;
		padding: 2px 2px;
		letter-spacing: -1px;
		background-color: #c0c0c0;
	}
	.manufacturer {
		font-size: 12pt;
		width: 1.2in;
		top: 0.4in;
		left: 0.05in;
		font-weight: 900;
		padding: 6px 1px;
		letter-spacing: -1px;
		padding: 2px 2px;
		background-color: #c0c0c0;
	}
	.model {
		font-size: 12pt;
		width: 1.2in;
		top: 0.3in;
		left: 0.05in;
		font-weight: 900;
		padding: 2px 2px;
		letter-spacing: -1px;
		background-color: #c0c0c0;
	}
	.model-type {
		font-size: 12pt;
		width: 1.2in;
		top: 0.2in;
		left: 0.05in;
		font-weight: 900;
		padding: 2px 2px;
		letter-spacing: -1px;
		background-color: #c0c0c0;
	}
	.color {
		width: 1.2in;
		top: 0.1in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #c0c0c0;
	}
	.vin {
		font-size: 9pt;
		width: 1.2in;
		top: 0.02in;
		left: 0.05in;
		font-weight: 400;
		padding: 5px 0px;
		background-color: #c0c0c0;
	}
	.usage-value {
		text-align: center;
		font-size: 8pt;
		width: 0.2in;
		top: 0.01in;
		left: 0.01in;
		font-weight: 900;
		padding: 5px 1px;
	}
	.usage-type {
		text-align: center;
		font-size: 8pt;
		width: 0.2in;
		top: -0.265in;
		left: 0.2in;
		font-weight: 900;
		letter-spacing: -1px;
		padding: 5px 1px;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-gray) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 3in !important;
			height: 3in !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.versa-tag-gray svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
