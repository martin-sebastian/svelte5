<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';

	const { vehicle } = $props<{ vehicle: Vehicle }>();
</script>

<div class="versa-tag-content overflow-hidden text-left text-xs">
	<div class="mt-1 text-[10pt]">
		{vehicle.usage}
	</div>
	<div class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[14pt] font-bold">
		#{vehicle.stockNumber}
	</div>
	<div class="mb-1 text-[14pt] font-bold">
		{vehicle.year}
	</div>
	<div class="mb-1 text-[12pt] font-bold">
		{vehicle.manufacturer}
	</div>
	<div class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[10pt] font-bold">
		{vehicle.modelType}
		{vehicle.modelName}
	</div>
	<div class="mb-1 overflow-hidden text-[10pt]">
		{vehicle.color}
	</div>
	<div class="mb-0 text-[10pt]">
		{vehicle.metricValue}
		{vehicle.metricType}
	</div>
	<div class="mb-1 text-[9pt]">
		{vehicle.vin}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-content) {
		/* Force black text regardless of theme */
		color: #000000 !important;
		/* Base spacing variables */
		--spacing-unit: 0.125in;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-content) {
			/* Ensure black text in print */
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		/* Adjust font sizes for print */
		:global(.versa-tag-content .text-\[14pt\]) {
			font-size: 14pt !important;
		}
		:global(.versa-tag-content .text-\[12pt\]) {
			font-size: 12pt !important;
		}
		:global(.versa-tag-content .text-\[10pt\]) {
			font-size: 10pt !important;
		}
		:global(.versa-tag-content .text-\[9pt\]) {
			font-size: 9pt !important;
		}

		/* Print margins and spacing */
		:global(.versa-tag-content) {
			margin: 0 !important;
			padding: var(--spacing-unit) !important;
		}
	}
</style>
