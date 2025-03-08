<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { Check } from 'lucide-svelte';
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
	export const width = '3in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Standard Versa Tag with white background';
</script>

<div class="cover versa-tag-standard" style={backgroundImageStyle}>
	<div class="versa-tag-standard-inner">
		<!-- NEW checkbox -->
	</div>
	<!-- NEW checkbox -->
	<div class="new">
		{#if $vehicle?.usage?.toLowerCase() === 'new'}
			NEW
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="used">
		{#if $vehicle?.usage?.toLowerCase() === 'used'}
			USED
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="stock-number">
		#{$vehicle?.stockNumber || ''}
	</div>

	<!-- Year -->
	<div class="year">
		{$vehicle?.year || ''}
	</div>

	<!-- Manufacturer -->
	<div class="manufacturer">
		{$vehicle?.manufacturer || ''}
	</div>

	<!-- Model -->
	<div class="model">
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div class="model-type">
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div class="color">
		{$vehicle?.color || ''}
	</div>

	<!-- Metrics -->
	<div class="usage">
		<div class="usage-value">
			{$vehicle?.metricValue?.toString() || ''}
		</div>
		<div class="usage-type">
			{$vehicle?.metricType || ''}
		</div>
	</div>

	<!-- VIN -->
	<div class="vin">
		{$vehicle?.vin || ''}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-standard) {
		position: relative;
		width: 3in;
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
	.versa-tag-standard-inner {
		position: absolute;
		width: 1.22in;
		top: 0;
		left: 0;
		bottom: 0;
		right: 1.22in;
		background-color: #ffe109;
	}
	.new {
		position: absolute;
		font-size: 12pt;
		font-weight: 900;
		top: 0.2in;
		left: 0.09in;
	}
	.used {
		position: absolute;
		top: 0.26in;
		left: 0.19in;
	}

	.stock-number {
		position: absolute;
		font-size: 11pt;
		line-height: 11pt;
		width: 1.22in;
		top: 0.5in;
		left: 0.05in;
		font-weight: 900;
		letter-spacing: -1px;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.year {
		position: absolute;
		font-size: 14pt;
		width: 1.22in;
		top: 0.85in;
		left: 0.05in;
		font-weight: 900;
		padding: 1px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.manufacturer {
		position: absolute;
		font-size: 11pt;
		line-height: 11pt;
		width: 1.2in;
		top: 1.1in;
		left: 0.05in;
		font-weight: 900;
		padding: 6px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.model {
		position: absolute;
		font-size: 11pt;
		line-height: 11pt;
		width: 1.2in;
		top: 1.54in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.model-type {
		position: absolute;
		font-size: 10pt;
		line-height: 10pt;
		width: 1.25in;
		top: 2.2in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.color {
		position: absolute;
		width: 1.2in;
		top: 2.22in;
		left: 0.05in;
		font-weight: 900;
		padding: 1px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.vin {
		position: absolute;
		font-size: 10pt;
		width: 1.2in;
		top: 2.45in;
		left: 0.05in;
		font-weight: 800;
		padding: 1px 0px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.usage-value {
		position: absolute;
		text-align: center;
		font-size: 10pt;
		width: 1.2in;
		top: 2.6in;
		left: -0.49in;
		letter-spacing: -1px;
		font-weight: 900;
		padding: 5px 1px;
	}
	.usage-type {
		position: absolute;
		text-align: center;
		font-size: 10pt;
		width: 1.2in;
		top: 2.6in;
		left: -0.15in;
		letter-spacing: -1px;
		font-weight: 900;
		padding: 5px 1px;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-standard) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
			width: 3in !important;
			height: 3in !important;
			/* Remove debug outline in print */
			outline: none !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.versa-tag-standard svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}

		/* Force background colors to print */
		:global(.stock-number),
		:global(.year),
		:global(.manufacturer),
		:global(.model),
		:global(.model-type),
		:global(.color),
		:global(.vin),
		:global(.usage-value),
		:global(.usage) .usage-type {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
	}
</style>
