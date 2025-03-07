<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { CircleGauge, Car, Check, BadgeCheck } from 'lucide-svelte';
	import { vehicle } from '$lib/stores/keyTagState.svelte';
	import { versaTagStandardYellow } from '../assets';

	// Add metadata for the template selector
	export const name = 'Versa Tag Yellow';
	export const width = '1.22in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Yellow Versa Tag for high visibility';

	// Use the variable in a way that the linter can detect
	const backgroundStyle = `background-image: url('${versaTagStandardYellow}') !important;`;
</script>

<div class="versa-tag-standard-yellow" style={backgroundStyle}>
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
	<div class="stock-number relative line-clamp-2 leading-none">
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
	<div class="model relative line-clamp-1">
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div class="model-type relative line-clamp-1">
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div class="color relative">
		{$vehicle?.color || ''}
	</div>

	<!-- VIN -->
	<div class="vin relative">
		{$vehicle?.vin || ''}
	</div>

	<!-- Metrics -->
	<div class="usage-value relative">
		{$vehicle?.metricValue?.toString() || ''}
	</div>
	<!-- Metrics -->
	<div class="usage-type relative">
		{$vehicle?.metricType?.toUpperCase() || ''}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-standard-yellow) {
		position: relative;
		text-align: left;
		width: 3in;
		height: 3in;
		margin: 0;
		color: #000000 !important;
		background-color: #ffeb3b !important;
		background-size: cover !important;
		background-position: center !important;
		background-repeat: no-repeat !important;
		overflow: hidden;
		text-transform: uppercase;
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
		font-weight: 900;
		letter-spacing: -1px;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.year {
		font-size: 16pt;
		width: 1.2in;
		top: 0.5in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.manufacturer {
		font-size: 12pt;
		width: 1.2in;
		top: 0.4in;
		left: 0.05in;
		font-weight: 900;
		padding: 6px 1px;
		background-color: #ffe109;
	}
	.model {
		font-size: 12pt;
		width: 1.2in;
		top: 0.3in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.model-type {
		font-size: 12pt;
		width: 1.2in;
		top: 0.2in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.color {
		width: 1.2in;
		top: 0.1in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.vin {
		font-size: 9pt;
		width: 1.2in;
		top: 0.02in;
		left: 0.05in;
		font-weight: 400;
		padding: 5px 0px;
		background-color: #ffe109;
	}
	.usage-value {
		text-align: center;
		font-size: 8pt;
		width: 1.2in;
		top: 0.01in;
		left: 0.01in;
		font-weight: 900;
		padding: 5px 1px;
	}
	.usage-type {
		text-align: center;
		font-size: 8pt;
		width: 1.2in;
		top: -0.18in;
		left: 0.001in;
		font-weight: 900;
		padding: 5px 1px;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-standard-yellow) {
			/* Ensure black text in print */
			position: relative;
			left: 0;
			top: 0;
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 1.5in !important;
			height: 3in !important;
			background-image: url('{versaTagStandardYellow}') !important;
		}

		/* Ensure icons and boxes print correctly */
		:global(.versa-tag-standard-yellow svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
