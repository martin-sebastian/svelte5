<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const { vehicle } = data;

	// Add zoom state
	let zoomLevel = 0.5; // Start at 50% zoom

	const zoomIn = () => {
		zoomLevel = Math.min(zoomLevel + 0.1, 1.5);
	};

	const zoomOut = () => {
		zoomLevel = Math.max(zoomLevel - 0.1, 0.2);
	};

	const handlePrint = () => {
		window.print();
	};
</script>

{#if vehicle}
	<div class="fixed bottom-4 right-4 flex gap-2 print:hidden">
		<button
			on:click={handlePrint}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Print hangtag"
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

	<div class="dots flex h-screen w-full items-center justify-center overflow-hidden p-4">
		<div
			class="hangtag-card h-[11in] w-[8.5in] overflow-hidden bg-white text-black shadow-lg"
			style="transform: scale({zoomLevel}); transform-origin: center;"
		>
			<div class="grid grid-cols-2 gap-4">
				<div class="left-column flex flex-col justify-center text-center">
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
				<div class="right-column flex flex-col justify-center">
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Price: {vehicle.priceType}
						{#if vehicle.price}
							${(vehicle.price / 100).toLocaleString()}
						{:else}
							Not Available
						{/if}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						{vehicle.stockNumber}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Usage: {vehicle.usage}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Year: {vehicle.year}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Make: {vehicle.manufacturer}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Model: {vehicle.modelName}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Metric: {vehicle.metricValue}
						{vehicle.metricType}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Model Type: {vehicle.modelType}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						VIN: {vehicle.vin}
					</div>
					<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
						Condition: {vehicle.condition}
					</div>
					{#if vehicle.trimName}
						<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
							Trim: {vehicle.trimName}
						</div>
					{/if}
					{#if vehicle.trimColor}
						<div class="text-md mb-1 border-b border-gray-500/25 px-4 py-2">
							Trim Color: {vehicle.trimColor}
						</div>
					{/if}
					<div class="text-md mb-1 px-4 py-2">Location: {vehicle.location}</div>
				</div>
			</div>
		</div>
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
	.hangtag-card {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}
	.grid {
		position: relative;
	}
	.grid::after {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		height: 100%;
		width: 0;
		border-left: 1px dashed #000;
		transform: translateX(-50%);
	}
	@media print {
		.hangtag-card {
			transform: scale(1) !important; /* Reset zoom for printing */
			width: 8.5in !important;
			height: 11in !important;
			margin: 0 !important;
			padding: 0.25in !important;
			overflow: hidden !important;
			background-color: white !important;
		}
	}
</style>
