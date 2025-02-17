<script lang="ts">
	import { keyTagState, setTemplate, setZoom, loadVehicleData } from './keyTagState';
	import { TemplateSelector, templates } from './index';
	import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-svelte';
	import type { TemplateId } from './types';

	const { vehicleId } = $props<{ vehicleId: string }>();

	// Reactive state
	const zoom = $derived($keyTagState.zoom);
	const selectedTemplate = $derived($keyTagState.selectedTemplateId as TemplateId);

	// Set default template if none selected
	$effect(() => {
		if (!selectedTemplate) {
			setTemplate('standard');
		}
	});

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

	$effect(() => {
		if (vehicleId) {
			loadVehicleData(vehicleId);
		}
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
		{#if isLoading}
			<div class="flex h-full items-center justify-center p-4">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
			</div>
		{:else if selectedTemplate}
			{#key selectedTemplate}
				{templates[selectedTemplate]({ vehicleId })}
			{/key}
		{/if}
	</div>
</div>

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
