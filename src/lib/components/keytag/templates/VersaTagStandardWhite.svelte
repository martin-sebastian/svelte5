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

	// Create background style variables
	const backgroundImageStyle = `background-image: url('${versaTagWhite}') !important;`;

	// Add metadata for the template selector
	export const name = 'Versa Tag White';
	export const width = '1.22in';
	export const height = '3in';
	export const orientation = 'Portrait';
	export const description = 'White Versa Tag with clean design';
</script>

<div class="versa-tag-white" style={backgroundImageStyle}>
	<!-- NEW checkbox -->
	<div class="new relative left-[0.0in] top-[0.26in]">
		{#if $vehicle?.usage?.toLowerCase() === 'new'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- USED checkbox -->
	<div class="used relative left-[0.0in] top-[0.26in]">
		{#if $vehicle?.usage?.toLowerCase() === 'used'}
			<Check class="h-5 w-5" />
		{/if}
	</div>

	<!-- Stock Number -->
	<div
		class="stock-number relative left-[0.00in] top-[0.61in] line-clamp-2 text-[11pt] font-bold leading-none"
	>
		#{$vehicle?.stockNumber || ''}
	</div>

	<!-- Year -->
	<div class="year relative right-[0.00in] top-[0.994in] text-[10pt] font-bold">
		{$vehicle?.year || ''}
	</div>

	<!-- Manufacturer -->
	<div
		class="manufacturer relative right-[0.00in] top-[1.292in] line-clamp-2 text-[8pt] font-bold leading-none"
	>
		{$vehicle?.manufacturer || ''}
	</div>

	<!-- Model -->
	<div
		class="model relative left-[0.0in] top-[1.539in] line-clamp-2 text-[8pt] font-bold leading-none"
	>
		{$vehicle?.modelName || ''}
	</div>

	<!-- Model Type/BODY -->
	<div
		class="model-type relative left-[0.00in] top-[1.788in] line-clamp-2 text-[8pt] font-bold leading-none"
	>
		{$vehicle?.modelType || ''}
	</div>

	<!-- Color -->
	<div
		class="color relative right-[0.0in] top-[2.035in] line-clamp-2 text-[8pt] font-bold leading-none"
	>
		{$vehicle?.color || ''}
	</div>

	<!-- Metrics -->
	<div
		class="usage relative flex flex-row items-center justify-center gap-[0.05in] text-[8pt] font-bold"
	>
		<div class="usage-value relative">
			{$vehicle?.metricValue || ''}
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
	:global(.versa-tag-white) {
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
	/* Ensure icons and boxes print correctly */
	:global(.standard-label svg) {
		color: #000000 !important;
		stroke: #000000 !important;
		fill: #000000 !important;
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
		background-color: #fafafa;
	}
	.year {
		font-size: 16pt;
		width: 1.22in;
		top: 0.5in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.manufacturer {
		font-size: 12pt;
		width: 1.22in;
		top: 0.4in;
		left: 0.05in;
		font-weight: 900;
		padding: 6px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.model {
		font-size: 12pt;
		width: 1.22in;
		top: 0.3in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.model-type {
		font-size: 12pt;
		width: 1.22in;
		top: 0.2in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.color {
		width: 1.22in;
		top: 0.1in;
		left: 0.05in;
		font-weight: 900;
		padding: 5px 1px;
		letter-spacing: -1px;
		background-color: #fafafa;
	}
	.vin {
		font-size: 8pt;
		width: 1.22in;
		top: 0.02in;
		left: 0.05in;
		font-weight: 400;
		padding: 5px 0px;
		letter-spacing: -1px;
		background-color: #fafafa;
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
		:global(.versa-tag-white) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 1.22in !important;
			height: 3in !important;
		}
	}
</style>
