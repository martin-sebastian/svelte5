<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
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

	const handleClose = () => {
		goto('/admin/vehicles');
	};
</script>

{#if vehicle}
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
					<div class="logo">
						<svg id="hdLogo" viewBox="0 0 276 223.55">
							<path
								class="cls-1"
								d="M0,76.78h60.85c-.7-7.22-6.87-11.51-12.91-14.33v-24.61c24.62-1.59,49.77-7.01,70.68-20.47,7.15-4.6,14.39-10.4,19.28-17.37,4.76,5.99,10.48,11.13,16.78,15.49,17.1,11.83,38.52,18.38,59.09,21.01,4.75.61,9.54.88,14.31,1.34v24.61c-5.85,2.89-12.35,7.11-12.7,14.33h60.3l.33.33v71.31l-.33.33h-60.08c2.59,8.84,12.14,13.6,20.57,15.31-26.6,27.74-60.12,50.18-97.84,59.49h-.66l-12.52-3.56c-29.44-10.04-56.07-27.51-78.43-48.93-1.6-1.53-5.34-4.85-6.45-6.46-.13-.19-.3-.22-.22-.55,8.28-1.74,18-6.51,20.35-15.31H0v-71.97h0ZM210.34,52.07c-26.24-.24-51.4-10.68-72.34-25.82-20.78,15.22-46,25.52-72.11,25.82,1.05,1.56,2.51,2.81,3.71,4.27,4.8,5.83,8.78,12.66,9.63,20.31l117.76.14c.7-9.67,6.98-17.88,13.35-24.72ZM258.93,93.63H17.29v38.28h241.31l.33-.33v-37.95h0ZM196.74,148.78l-116.97-.03c-.75.14-.75,1.47-.98,2.09-2.47,6.64-6.82,11.27-12.7,15.09,7.65,6.82,16.22,12.98,24.97,18.35,14.58,8.97,30.42,16.26,47.09,20.42,23.17-6.08,45.14-17.7,64.05-32.24,2.26-1.73,5.4-4.02,7.36-5.99.16-.16.59-.45.44-.66-6.29-3.84-11.56-9.71-13.27-17.04h0Z"
							/>
							<g>
								<path
									class="cls-2"
									d="M48.92,99.38c7.63,0,12.71,4.93,12.71,12.42s-5.08,12.42-12.71,12.42h-8.35c-.25,0-.5-.25-.5-.54v-23.76c0-.29.25-.54.5-.54h8.35ZM49.35,117.73c2.77,0,4.64-2.38,4.64-5.94s-1.87-5.94-4.64-5.94h-1.87v11.88h1.87Z"
								/>
								<path
									class="cls-2"
									d="M80.88,117.73c.29,0,.54.22.54.47v5.51c0,.25-.25.5-.54.5h-16.74c-.25,0-.5-.29-.58-.54v-23.79c0-.32.18-.5.5-.5h16.38c.32,0,.58.25.58.5v5.44c0,.32-.25.54-.58.54h-9.39v2.84h7.63c.32,0,.5.25.47.47l-.5,5.04c-.04.22-.29.47-.61.47h-6.98v3.06h9.83Z"
								/>
								<path
									class="cls-2"
									d="M106.91,123.75c.11.22-.04.47-.32.47h-7.13c-.32,0-.61-.18-.76-.47l-1.08-3.78h-6.77l-1.08,3.78c-.14.29-.43.47-.76.47h-7.13c-.29,0-.43-.25-.32-.47l8.14-23.9c.11-.22.5-.47.86-.47h7.34c.36,0,.76.25.86.47l8.13,23.9ZM94.24,107.98l-1.94,6.84h3.89l-1.94-6.84Z"
								/>
								<path
									class="cls-2"
									d="M121.78,117.73c.25,0,.47.22.47.5l-.5,5.47c-.04.25-.29.5-.58.5h-12.99c-.29,0-.54-.25-.54-.5v-23.79c0-.29.25-.54.54-.54h6.37c.29,0,.54.25.54.54v17.82h6.69Z"
								/>
								<path
									class="cls-2"
									d="M141,117.73c.29,0,.54.22.54.47v5.51c0,.25-.25.5-.54.5h-16.74c-.25,0-.5-.29-.58-.54v-23.79c0-.32.18-.5.5-.5h16.38c.32,0,.58.25.58.5v5.44c0,.32-.25.54-.58.54h-9.39v2.84h7.63c.32,0,.5.25.47.47l-.5,5.04c-.04.22-.29.47-.61.47h-6.98v3.06h9.83Z"
								/>
								<path
									class="cls-2"
									d="M164.12,123.64c.18.32-.07.58-.4.58h-7.7c-.36,0-.68-.25-.83-.58l-3.74-7.85h-.43v7.92c0,.25-.25.5-.58.5h-6.33c-.29,0-.54-.25-.54-.5v-23.79c0-.29.25-.54.54-.54h9.5c5.54,0,9.21,3.24,9.21,8.13,0,2.84-1.73,5.72-4.43,6.88l5.72,9.25ZM153.14,109.67c1.22,0,2.05-.76,2.05-1.91s-.83-1.91-2.05-1.91h-2.12v3.82h2.12Z"
								/>
								<path
									class="cls-2"
									d="M167.47,116.65c.11-.36.36-.47.65-.29,1.66.94,3.64,1.62,5,1.73,1.15,0,1.91-.54,1.91-1.37,0-2.12-10.11-2.02-10.11-9.86,0-4.82,3.64-8.03,9.11-8.03,2.56,0,5.8,1.04,8.06,2.59.29.18.4.47.29.65l-2.27,5.08c-.11.36-.36.47-.65.29-1.76-1.01-3.82-1.76-5.08-1.87-1.12,0-1.84.5-1.84,1.3,0,2.12,10.19,1.98,10.19,9.9,0,4.79-3.71,7.99-9.25,7.99-3.02,0-6.19-.94-7.99-2.38-.29-.22-.4-.47-.29-.65l2.27-5.08Z"
								/>
								<path
									class="cls-2"
									d="M204.79,99.38c.32,0,.54.25.54.54v23.79c0,.25-.22.5-.54.5h-6.73c-.29,0-.5-.25-.5-.5v-8.06h-5.04v8.06c0,.25-.22.5-.54.5h-6.73c-.25,0-.5-.25-.5-.5v-23.79c0-.29.25-.54.5-.54h6.73c.32,0,.54.25.54.54v9.39h5.04v-9.39c0-.29.22-.54.5-.54h6.73Z"
								/>
								<path
									class="cls-2"
									d="M214.8,99.38c.32,0,.54.25.54.54v23.79c0,.25-.22.5-.54.5h-6.37c-.25,0-.5-.25-.5-.5v-23.79c0-.29.25-.54.5-.54h6.37Z"
								/>
								<path
									class="cls-2"
									d="M226.94,99.38c6.3,0,10.08,3.42,10.08,8.57s-3.78,8.57-10.08,8.57h-1.48v7.2c0,.25-.25.5-.58.5h-6.44c-.25,0-.5-.25-.5-.5v-23.79c0-.29.25-.54.5-.54h8.5ZM227.26,110.07c1.26,0,2.12-.86,2.12-2.12s-.86-2.12-2.12-2.12h-1.87v4.25h1.87Z"
								/>
							</g>
						</svg>
					</div>
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
