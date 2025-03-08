<script lang="ts">
	import { Check } from 'lucide-svelte';
	import { vehicle as vehicleStore } from '$lib/stores/keyTagState.svelte';
	import { versaTagWhite } from '../assets';

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

	// Create background style variable
	const backgroundImageStyle = `background-image: url('${versaTagWhite}') !important;`;

	// Add metadata for the template selector
	export const name = 'Versa Tag White Custom';
	export const width = '1.22in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Customized white Versa Tag with additional fields';
</script>

<div class="versa-tag-white-custom" style={backgroundImageStyle}>
	<!-- NEW checkbox -->
	<div class="new relative">
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
		#{$vehicle?.stockNumber || ''}
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
	<div class="usage relative">
		<span class="usage-value">{$vehicle?.metricValue || ''}</span>
		<span class="usage-type">{$vehicle?.metricType || ''}</span>
	</div>

	<!-- VIN -->
	<div class="vin relative">
		{$vehicle?.vin || ''}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-white-custom) {
		position: relative;
		width: 3in;
		height: 3in;
		color: #000000 !important;
		background-color: #ffffff !important;
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
		position: relative;
		font-size: 13pt;
		line-height: 13pt;
		width: 1.22in;
		top: 0.59in;
		left: 0.05in;
		font-weight: 900;
		letter-spacing: -1px;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0px 1px;
		background-color: #fafafa;
	}
	.year {
		position: relative;
		font-size: 16pt;
		width: 1.22in;
		top: 0.56in;
		left: 0.05in;
		font-weight: 900;
		padding: 0px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.manufacturer {
		position: relative;
		font-size: 12pt;
		line-height: 12pt;
		width: 1.22in;
		top: 0.43in;
		left: 0.05in;
		font-weight: 900;
		padding: px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.model {
		position: relative;
		font-size: 12pt;
		line-height: 12pt;
		width: 1.22in;
		top: 0.45in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.model-type {
		position: relative;
		font-size: 12pt;
		line-height: 12pt;
		width: 1.22in;
		top: 0.21in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.color {
		position: relative;
		width: 1.22in;
		top: 0.2in;
		left: 0.05in;
		font-weight: 900;
		padding: 0px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.vin {
		position: absolute;
		font-size: 8pt;
		width: 1.22in;
		top: 0.005in;
		left: 0.05in;
		font-weight: 400;
		padding: 5px 0px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.usage {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.05in;
	}
	.usage-value {
		text-align: center;
		font-size: 8pt;
		width: 1.22in;
		top: 0.01in;
		left: 0.01in;
		letter-spacing: -1px;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.usage-type {
		text-align: center;
		font-size: 8pt;
		width: 1.22in;
		top: -0.18in;
		left: 0.001in;
		letter-spacing: -1px;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-white-custom) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 1.5in !important;
			height: 3in !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.versa-tag-white-custom svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
