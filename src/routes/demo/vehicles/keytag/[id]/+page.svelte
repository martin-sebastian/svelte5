<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;

	const { vehicle } = data;

	// Add zoom functionality
	let scale = 2;
	const zoomIn = () => (scale = Math.min(scale + 0.1, 3));
	const zoomOut = () => (scale = Math.max(scale - 0.1, 0.5));
	const handlePrint = () => {
		window.print();
	};

	const handleClose = () => {
		goto('/demo/vehicles');
	};
</script>

{#if vehicle}
	<div class="dots flex h-screen w-full items-center justify-center overflow-hidden p-4">
		<div
			class="label-card h-[2in] w-[1.5in] overflow-hidden rounded-lg border border-gray-500/25 bg-white text-black"
			style="transform: scale({scale}); transform-origin: center;"
		>
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
		</div>
	</div>

	<div class="fixed bottom-4 right-4 flex gap-2 print:hidden">
		<button
			on:click={handleClose}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Close and return to vehicles"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
		<button
			on:click={handlePrint}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Print keytag"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"
				/>
			</svg>
		</button>
		<button
			on:click={zoomOut}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom out"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
			</svg>
		</button>
		<button
			on:click={zoomIn}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom in"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
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
