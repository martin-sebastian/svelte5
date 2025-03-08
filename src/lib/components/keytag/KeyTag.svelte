<script lang="ts">
	import {
		vehicle,
		selectedTemplateId,
		zoom,
		isLoading,
		setTemplate,
		setZoom
	} from '$lib/stores/keyTagState.svelte';
	import { TemplateSelector, templates } from './index';
	import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-svelte';
	import type { TemplateId } from './types';
	import { goto } from '$app/navigation';
	import PrintInstructions from './PrintInstructions.svelte';

	export let vehicleId: string;

	// Debug logs
	$: {
		console.log('KeyTag Component - vehicleId:', vehicleId);
		console.log('KeyTag Component - vehicle data:', $vehicle);
		console.log('KeyTag Component - selected template:', $selectedTemplateId);

		// Add detailed logging of specific fields
		if ($vehicle) {
			console.log('Vehicle fields available:', {
				stockNumber: $vehicle.stockNumber,
				year: $vehicle.year,
				manufacturer: $vehicle.manufacturer,
				modelName: $vehicle.modelName,
				modelType: $vehicle.modelType,
				color: $vehicle.color,
				usage: $vehicle.usage,
				metricValue: $vehicle.metricValue,
				metricType: $vehicle.metricType,
				vin: $vehicle.vin
			});
		}
	}

	// Set default template if none selected
	$: if (!$selectedTemplateId) {
		setTemplate('standard');
	}

	// Zoom controls
	function handleZoomIn() {
		setZoom($zoom + 0.1);
	}

	function handleZoomOut() {
		setZoom($zoom - 0.1);
	}

	function handleResetZoom() {
		setZoom(1);
	}

	// Debug logs
	$: {
		console.log('Vehicle:', $vehicle);
		console.log('Selected Template:', $selectedTemplateId);
		console.log('Is Loading:', $isLoading);
	}

	// Type assertion for templates
	$: currentTemplate = $selectedTemplateId
		? templates[$selectedTemplateId as keyof typeof templates]
		: null;
</script>

<!-- Template Selector -->
<TemplateSelector />
<div
	class="dots flex items-center justify-center overflow-auto bg-gray-50 p-4 py-10 dark:bg-gray-900/90"
>
	<div class="flex items-center justify-center">
		<!-- Key Tag Preview -->
		<div
			class="relative overflow-hidden rounded border"
			style="transform: scale({$zoom}); transform-origin: center;"
		>
			{#if $vehicle && $selectedTemplateId}
				{#if $selectedTemplateId && currentTemplate}
					<svelte:component this={currentTemplate} />
				{/if}
			{:else}
				<div class="flex h-full flex-row items-center justify-start p-4">
					<p>Loading vehicle data...</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Zoom Controls -->
<div class="flex justify-center gap-4 p-4">
	<button
		class="flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-sm hover:bg-gray-300"
		onclick={handleZoomOut}
	>
		<ZoomOut class="h-4 w-4" />
		<span>Zoom Out</span>
	</button>
	<button
		class="flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-sm hover:bg-gray-300"
		onclick={handleResetZoom}
	>
		<RotateCcw class="h-4 w-4" />
		<span>Reset</span>
	</button>
	<button
		class="flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-sm hover:bg-gray-300"
		onclick={handleZoomIn}
	>
		<ZoomIn class="h-4 w-4" />
		<span>Zoom In</span>
	</button>

	<!-- Print Button -->
	<a
		href="/admin/vehicles/keytag/{vehicleId}/print?template={$selectedTemplateId}"
		target="_blank"
		class="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-4 w-4"
		>
			<polyline points="6 9 6 2 18 2 18 9"></polyline>
			<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
			<rect x="6" y="14" width="12" height="8"></rect>
		</svg>
		<span>Print</span>
	</a>
</div>

<style>
	.dots {
		background-image: radial-gradient(
			circle at center,
			rgba(120, 120, 120, 0.2) 1px,
			transparent 1px
		);
		background-size: 10px 10px;
	}
</style>
