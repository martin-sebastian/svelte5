<script lang="ts">
	import type { Vehicle } from '$lib/types/vehicle';
	import { keyTagStore, type KeyTagTemplate } from '$lib/stores/keyTagStore';
	import { CircleGauge, Car, Check } from 'lucide-svelte';

	const { vehicle } = $props<{ vehicle: Vehicle }>();
	const template = $derived(
		$keyTagStore.templates[
			'versa-tag-white' as keyof typeof $keyTagStore.templates
		] as KeyTagTemplate
	);
</script>

<div
	class="relative"
	style:width={template.width}
	style:height={template.height}
	style:background-color={template.backgroundColor}
	style:border-width={template.borderWidth}
	style:border-color={template.borderColor}
	style:border-style="solid"
>
	<!-- Printable Area Container -->
	<div
		class="absolute overflow-hidden"
		style:width={template.printableArea.width}
		style:height={template.printableArea.height}
		style:margin-top={template.printableArea.marginTop}
		style:margin-left={template.printableArea.marginLeft}
		style:border-width={template.printableArea.borderWidth}
		style:border-color={template.printableArea.borderColor}
		style:border-style="solid"
	>
		<!-- Content with automatic truncation -->
		<div class="flex h-full flex-col p-1">
			<div class="text-center text-xs font-bold uppercase">
				<div class="truncate">{vehicle.year} {vehicle.manufacturer}</div>
				<div class="truncate">{vehicle.title}</div>
			</div>
			<div class="mt-1 text-center text-[8pt]">
				<div class="truncate">Stock: {vehicle.stockNumber || 'N/A'}</div>
				<div class="truncate">VIN: {vehicle.vin || 'N/A'}</div>
			</div>
		</div>
	</div>

	<!-- Checkboxes -->
	<div class="absolute left-[0.09in] top-[0.26in]">
		<div class="flex items-center gap-1">
			<div class="h-3 w-3 rounded-sm border border-black bg-white">
				{#if vehicle.usage?.toLowerCase() === 'new'}
					<Check class="h-3 w-3" />
				{/if}
			</div>
			<span class="text-[6pt]">NEW</span>
		</div>
	</div>

	<div class="absolute left-[0.09in] top-[0.38in]">
		<div class="flex items-center gap-1">
			<div class="h-3 w-3 rounded-sm border border-black bg-white">
				{#if vehicle.usage?.toLowerCase() === 'used'}
					<Check class="h-3 w-3" />
				{/if}
			</div>
			<span class="text-[6pt]">USED</span>
		</div>
	</div>

	<div class="absolute left-[0.09in] top-[0.50in]">
		<div class="flex items-center gap-1">
			<div class="h-3 w-3 rounded-sm border border-black bg-white">
				{#if vehicle.condition?.toLowerCase() === 'certified'}
					<Check class="h-3 w-3" />
				{/if}
			</div>
			<span class="text-[6pt]">CERTIFIED</span>
		</div>
	</div>

	<!-- Stock Number -->
	<div class="absolute left-[0.11in] top-[0.61in] line-clamp-2 text-[11pt] font-bold leading-none">
		#{vehicle.stockNumber}
	</div>

	<!-- Year -->
	<div class="absolute left-[0.11in] top-[0.994in] text-[10pt] font-bold">
		{vehicle.year}
	</div>

	<!-- Manufacturer -->
	<div class="absolute left-[0.11in] top-[1.292in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.manufacturer}
	</div>

	<!-- Model -->
	<div class="absolute left-[0.11in] top-[1.539in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.modelName}
	</div>

	<!-- Model Type/BODY -->
	<div class="absolute left-[0.11in] top-[1.788in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.modelType}
	</div>

	<!-- Color -->
	<div class="absolute left-[0.11in] top-[2.035in] line-clamp-2 text-[8pt] font-bold leading-none">
		{vehicle.color}
	</div>

	<!-- Metrics -->
	<div
		class="absolute left-[0.11in] top-[2.25in] flex items-center gap-[0.05in] text-[8pt] font-bold"
	>
		<CircleGauge class="h-[0.15in] w-[0.15in]" />
		{vehicle.metricValue?.toString() || ''}
		{vehicle.metricType}
	</div>

	<!-- VIN -->
	<div class="absolute bottom-[0.4in] left-[0.11in] line-clamp-2 text-[8pt] leading-none">
		{vehicle.vin}
	</div>
</div>

<style>
	/* Template-specific styles */
	:global(.versa-tag-white) {
		position: relative;
		width: 3in;
		height: 3in;
		color: #000000 !important;
		overflow: hidden;
		text-transform: uppercase;
	}

	/* Print-specific styles */
	@media print {
		:global(.versa-tag-white) {
			color: #000000 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
			width: 24in !important;
			height: 3in !important;
		}

		:global(.versa-tag-white svg) {
			color: #000000 !important;
			stroke: #000000 !important;
			fill: #000000 !important;
		}
	}
</style>
