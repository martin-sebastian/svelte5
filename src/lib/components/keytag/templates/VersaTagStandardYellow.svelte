<script lang="ts">
	import { Check } from 'lucide-svelte';
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
	<div class="new">
		{#if $vehicle?.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="used">
		{#if $vehicle?.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div class="stock-number line-clamp-2 leading-none">
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

	<!-- Color -->
	<div class="color">
		{$vehicle?.color || ''}
	</div>

	<!-- VIN -->
	<div class="vin">
		{$vehicle?.vin || ''}
	</div>

	<!-- Metrics -->
	<div class="usage">
		<span class="usage-value">
			{$vehicle?.metricValue || ''}
		</span>
		<!-- Metrics -->
		<span class="usage-type">
			{$vehicle?.metricType || ''}
		</span>
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
		position: absolute;
		font-size: 11pt;
		width: 1.22in;
		top: 0.59in;
		left: 0.05in;
		font-weight: 900;
		letter-spacing: -1px;
		text-overflow: ellipsis;
		padding: 5px 1px;
		background-color: #ffe109;
	}
	.year {
		position: absolute;
		font-size: 12pt;
		width: 1.22in;
		top: 0.96in;
		left: 0.05in;
		font-weight: 900;
		padding: 0px 1px;
		background-color: #ffe109;
	}
	.manufacturer {
		position: absolute;
		line-height: 10pt;
		font-size: 10pt;
		width: 1.2in;
		top: 1.2in;
		left: 0.05in;
		font-weight: 900;
		margin: 0;
		padding: 2px 1px;
		background-color: #ffe109;
	}
	.model {
		position: absolute;
		font-size: 10pt;
		line-height: 10pt;
		width: 1.2in;
		top: 1.55in;
		left: 0.05in;
		height: 35pt;
		line-clamp: 2;
		overflow: hidden;
		font-weight: 900;
		padding: 1px 1px;
		background-color: #ffe109;
	}
	.color {
		position: absolute;
		font-size: 12pt;
		width: 1.2in;
		top: 2in;
		left: 0.05in;
		font-weight: 900;
		padding: 2px 1px;
		background-color: #ffe109;
	}
	.vin {
		position: absolute;
		font-size: 10pt;
		width: 1.2in;
		top: 2.25in;
		left: 0.07in;
		font-weight: 800;
		padding: 1px 0px;
		background-color: #ffe109;
	}
	.usage {
		position: absolute;

		width: 1.2in;
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
	}
	.usage-value {
		position: absolute;
		text-align: left;
		font-size: 10pt;
		width: 1.2in;
		top: 2.5in;
		left: 0.06in;
		font-weight: 900;
		padding: 1px 1px;
	}
	.usage-type {
		position: absolute;
		text-align: left;
		font-size: 10pt;
		width: 1.2in;
		top: 2.5in;
		left: 0.2in;
		font-weight: 900;
		padding: 1px 1px;
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
			width: 3in !important;
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
