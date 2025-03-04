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

	export let vehicleId: string;

	// Debug logs
	$: {
		console.log('KeyTag Component - vehicleId:', vehicleId);
		console.log('KeyTag Component - vehicle data:', $vehicle);
		console.log('KeyTag Component - selected template:', $selectedTemplateId);
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

<div class="flex flex-col gap-4">
	<!-- Template Selector -->
	<TemplateSelector />

	<!-- Zoom Controls -->
	<div class="flex items-center gap-2">
		<button
			class="rounded-full p-2 hover:bg-gray-100"
			on:click={handleZoomOut}
			aria-label="Zoom Out"
		>
			<ZoomOut class="h-4 w-4" />
		</button>
		<button class="rounded-full p-2 hover:bg-gray-100" on:click={handleZoomIn} aria-label="Zoom In">
			<ZoomIn class="h-4 w-4" />
		</button>
		<button
			class="rounded-full p-2 hover:bg-gray-100"
			on:click={handleResetZoom}
			aria-label="Reset Zoom"
		>
			<RotateCcw class="h-4 w-4" />
		</button>
		<span class="text-sm text-gray-500">{Math.round($zoom * 100)}%</span>
	</div>

	<!-- Key Tag Preview -->
	<div
		class="relative overflow-hidden rounded border"
		style="transform: scale({$zoom}); transform-origin: top left;"
	>
		{#if $vehicle && $selectedTemplateId}
			{#if $selectedTemplateId && currentTemplate}
				<svelte:component this={currentTemplate} />
			{/if}
		{:else}
			<div class="flex h-full items-center justify-center p-4">
				<p>Loading vehicle data...</p>
			</div>
		{/if}
	</div>
</div>

{#if $vehicle}
	<div class="flex flex-col gap-4">
		<h1>{$vehicle.title || ''}</h1>
		{#if ($vehicle as any).description}
			<p>{($vehicle as any).description}</p>
		{/if}
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
