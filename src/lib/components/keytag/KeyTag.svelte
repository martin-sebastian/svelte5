<script lang="ts">
	import { keyTagState, setTemplate, setZoom } from './keyTagState';
	import { TemplateSelector, templates } from './index';
	import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-svelte';
	import type { TemplateId } from './types';
	import { vehicleData } from '$lib/stores/keyTagState';
	import { goto } from '$app/navigation';

	const { vehicleId } = $props<{ vehicleId: string }>();
	const vehicle = $derived($vehicleData);
	const selectedTemplate = $derived($keyTagState.selectedTemplateId as TemplateId);

	// Debug logs
	$effect(() => {
		console.log('KeyTag Component - vehicleId:', vehicleId);
		console.log('KeyTag Component - vehicle data:', vehicle);
		console.log('KeyTag Component - selected template:', selectedTemplate);
	});

	// Set default template if none selected
	$effect(() => {
		if (!selectedTemplate) {
			setTemplate('standard');
		}
	});

	// Reactive state
	const zoom = $derived($keyTagState.zoom);

	// Zoom controls
	function handleZoomIn() {
		setZoom(zoom + 0.1);
	}

	function handleZoomOut() {
		setZoom(zoom - 0.1);
	}

	function handleResetZoom() {
		setZoom(1);
	}

	// Load vehicle data when ID changes
	$effect(() => {
		if (vehicleId) {
			goto(`/admin/vehicles/keytag/${vehicleId}`).then(({ data }) => {
				if (data?.vehicle) {
					setVehicleData(data.vehicle);
				}
			});
		}
	});

	$effect(() => {
		console.log('Vehicle:', $vehicleData);
		console.log('Selected Template:', selectedTemplate);
		console.log('Is Loading:', isLoading);
	});

	const isLoading = $derived($keyTagState.isLoading);
</script>

<div class="flex flex-col gap-4">
	<!-- Template Selector -->
	<TemplateSelector />

	<!-- Zoom Controls -->
	<div class="flex items-center gap-2">
		<button
			class="rounded-full p-2 hover:bg-gray-100"
			onclick={handleZoomOut}
			aria-label="Zoom Out"
		>
			<ZoomOut class="h-4 w-4" />
		</button>
		<button class="rounded-full p-2 hover:bg-gray-100" onclick={handleZoomIn} aria-label="Zoom In">
			<ZoomIn class="h-4 w-4" />
		</button>
		<button
			class="rounded-full p-2 hover:bg-gray-100"
			onclick={handleResetZoom}
			aria-label="Reset Zoom"
		>
			<RotateCcw class="h-4 w-4" />
		</button>
		<span class="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
	</div>

	<!-- Key Tag Preview -->
	<div
		class="relative overflow-hidden rounded border"
		style:transform="scale({zoom})"
		style:transform-origin="top left"
	>
		{#if vehicle && selectedTemplate}
			{#if selectedTemplate && templates[selectedTemplate]}
				{templates[selectedTemplate]}
			{/if}
		{:else}
			<div class="flex h-full items-center justify-center p-4">
				<p>Loading vehicle data...</p>
			</div>
		{/if}
	</div>
</div>

{#if vehicle}
	<div class="flex flex-col gap-4">
		<h1>{vehicle.title}</h1>
		<p>{vehicle.description}</p>
	</div>
{/if}

<style>
	.key-tag {
		position: relative;
		overflow: hidden;
		padding: 0;
		margin: 0;
	}

	.printable-area {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0;
		margin: 0;
		z-index: 1;
	}

	@media print {
		.key-tag {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
