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
	export const width = '3in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'Standard Versa Tag with white background';
</script>

<div class="versa-tag-standard" style={backgroundImageStyle}>
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
	<div class="stock-number relative left-[0.0in] top-[0.61in] text-[11pt] font-bold">
		#{$vehicle?.stockNumber || ''}
	</div>

	<!-- Year -->
	<div class="year relative right-[0.0in] top-[0.994in] text-[10pt]">
		{$vehicle?.year || ''}
	</div>

	<!-- Manufacturer -->
	<div class="manufacturer relative right-[0.00in] top-[1.292in] text-[8pt] font-bold">
		{$vehicle?.manufacturer || ''}
	</div>

	<!-- Model -->
	<div class="model relative left-[0.0in] top-[1.539in] text-[8pt] font-bold">
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div class="model-type relative left-[0.00in] top-[1.788in] text-[8pt] font-bold">
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div class="color relative right-[0.0in] top-[2.035in] text-[8pt] font-bold">
		{$vehicle?.color || ''}
	</div>

	<!-- Metrics -->
	<div
		class="usage relative flex flex-row items-center justify-center gap-[0.05in] text-[8pt] font-bold"
	>
		<CircleGauge class="h-[0.15in] w-[0.15in]" />
		<div class="usage-value relative">
			{$vehicle?.metricValue?.toString() || ''}
		</div>
		<div class="usage-type relative">
			{$vehicle?.metricType || ''}
		</div>
	</div>

	<!-- VIN -->
	<div class="vin relative">
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
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.manufacturer {
		font-size: 12pt;
		width: 1.2in;
		top: 0.4in;
		left: 0.05in;
		font-weight: 900;
		padding: 6px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.model {
		font-size: 12pt;
		width: 1.2in;
		top: 0.3in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.model-type {
		font-size: 12pt;
		width: 1.2in;
		top: 0.2in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.color {
		width: 1.2in;
		top: 0.1in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.vin {
		font-size: 8pt;
		width: 1.2in;
		top: 0.02in;
		left: 0.05in;
		font-weight: 400;
		padding: 5px 0px;
		letter-spacing: -1px;
		background-color: #ffe109;
	}
	.usage-value {
		text-align: center;
		font-size: 8pt;
		width: 1.2in;
		top: 0.01in;
		left: 0.01in;
		letter-spacing: -1px;
		font-weight: 900;
		padding: 5px 1px;
	}
	.usage-type {
		text-align: center;
		font-size: 8pt;
		width: 1.2in;
		top: -0.18in;
		left: 0.001in;
		letter-spacing: -1px;
		font-weight: 900;
		padding: 5px 1px;
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
