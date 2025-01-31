<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import KeyTag from '$lib/components/keytag/KeyTag.svelte';
	import TemplateSelector from '$lib/components/keytag/TemplateSelector.svelte';
	import { Printer, X, ZoomIn, ZoomOut } from 'lucide-svelte';

	const data = $props();
	const { vehicle } = data;

	let scale = $state(2);

	const zoomIn = () => (scale = Math.min(scale + 0.1, 3));
	const zoomOut = () => (scale = Math.max(scale - 0.1, 0.5));
	const handlePrint = () => window.print();
	const handleClose = () => goto('/admin/vehicles');
</script>

{#if vehicle}
	<div class="dots flex h-screen w-full items-center justify-center overflow-hidden p-4">
		<div style:transform="scale({scale})" style:transform-origin="center">
			<KeyTag>
				<div class="overflow-hidden text-center text-xs">
					<div class="mt-1 text-[10pt]">
						{vehicle.usage}
					</div>
					<div
						class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[14pt] font-bold"
					>
						#{vehicle.stockNumber}
					</div>
					<div class="mb-1 text-[14pt] font-bold">
						{vehicle.year}
					</div>
					<div class="mb-1 text-[12pt] font-bold">
						{vehicle.manufacturer}
					</div>
					<div
						class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[10pt] font-bold"
					>
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
			</KeyTag>
		</div>
	</div>

	<div class="fixed bottom-4 right-4 flex gap-2 print:hidden">
		<TemplateSelector />
		<button
			on:click={handleClose}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Close and return to vehicles"
		>
			<X class="h-6 w-6" />
		</button>
		<button
			on:click={handlePrint}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Print keytag"
		>
			<Printer class="h-6 w-6" />
		</button>
		<button
			on:click={zoomOut}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom out"
		>
			<ZoomOut class="h-6 w-6" />
		</button>
		<button
			on:click={zoomIn}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom in"
		>
			<ZoomIn class="h-6 w-6" />
		</button>
	</div>
{:else}
	<div class="loading print:hidden">Loading...</div>
{/if}

<style>
	.dots {
		background-image: radial-gradient(
			circle at center,
			rgba(120, 120, 120, 0.2) 1px,
			transparent 1px
		);
		background-size: 10px 10px;
	}
	@media print {
		.label-card {
			width: 1.5in !important;
			height: 2in !important;
			margin: 0 !important;
			padding: 0.0125in !important;
			overflow: hidden !important;
		}
	}
</style>
