<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { CircleDashed } from 'lucide-svelte';
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';
	export let data;
	const { vehicle } = data;

	const primaryImage = vehicle.primaryImage;

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

	let qrCodeDataUrl = '';

	onMount(async () => {
		// Use the vehicle.link from the database
		const vehicleUrl = vehicle.link;

		try {
			qrCodeDataUrl = await QRCode.toDataURL(vehicleUrl, {
				width: 200,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			});
		} catch (err) {
			console.error('Error generating QR code:', err);
		}
	});
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
			<div class="grid grid-cols-2">
				<div class="left-column h-[11in] text-center">
					<CircleDashed class="mx-auto my-5 h-[0.5in] w-[0.5in] flex-none" />
					<div class="logo flex justify-center">
						<img src="/images/dealer-logo.png" alt="Logo" class="h-auto w-[3.5in]" />
					</div>
					<div class="mx-auto my-1 w-[2.5in] rounded-md py-2 text-center text-[20pt] font-bold">
						{vehicle.usage}
						{vehicle.metricValue}
						{vehicle.metricType}
					</div>
					<div
						class="mx-auto my-1 w-[2.5in] flex-none rounded-md bg-red-800 py-2 text-center text-[20pt] font-bold text-white"
					>
						#{vehicle.stockNumber}
					</div>
					<div class="mt-10">
						<div class="text-[30pt] font-extrabold leading-[0.9]">
							{vehicle.year}<br />
							{vehicle.manufacturer}
						</div>

						<div
							class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[18pt] font-bold"
						>
							{vehicle.modelName}
						</div>
						<div class="my-1 overflow-hidden text-[18pt]">
							{vehicle.color}
						</div>

						<div class="my-1 text-[20pt] font-bold">
							{vehicle.metricValue}
							{vehicle.metricType}
						</div>
						<div class="my-1 text-[18pt] font-bold">
							VIN: {vehicle.vin}
						</div>
						<div class="my-10">
							{#if qrCodeDataUrl}
								<img
									src={qrCodeDataUrl}
									alt="Vehicle QR Code"
									class="mx-auto h-[200px] w-[200px]"
								/>
							{:else}
								<CircleDashed class="mx-auto h-[200px] w-[200px]" />
							{/if}
						</div>
					</div>

					<div class="my-10">
						<div
							class="fixed bottom-0 left-0 z-10 mx-auto my-0 w-1/2 bg-red-800 p-6 text-center text-[44pt] font-bold text-white"
						>
							{#if vehicle.price}
								${(vehicle.price / 100).toLocaleString()}
							{:else}
								Not Available
							{/if}
						</div>
						<div
							class="fixed bottom-0 right-0 z-10 mx-auto my-0 w-1/2 bg-red-800 p-6 text-center text-[44pt] font-bold text-white"
						>
							{#if vehicle.price}
								${(vehicle.price / 100).toLocaleString()}
							{:else}
								Not Available
							{/if}
						</div>
					</div>
				</div>
				<div class="right-column h-[11in]">
					<CircleDashed class="mx-auto my-5 h-[0.5in] w-[0.5in] flex-none" />
					<div class="logo flex justify-center">
						<img src="/images/dealer-logo.png" alt="Logo" class="h-auto w-[3.5in]" />
					</div>
					<div class="my-5 w-full text-center">
						{#if vehicle.primaryImage}
							<img src={vehicle.primaryImage} alt="Vehicle" class="mx-auto w-1/2 rounded-lg" />
						{:else}
							n/a
						{/if}
					</div>

					<div class="line-clamp-8 my-1 px-10 text-[10pt]">
						{@html vehicle.description}
					</div>
					<div class="text-md my-5 w-full px-4 py-2 text-center font-bold">
						Location: {vehicle.location}
					</div>
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
	.left-column {
		border-right: 1px solid #ccc;
		padding: 0;
	}
	.right-column {
		border-left: 1px solid #ccc;
		padding: 0;
	}
	@media print {
		.hangtag-card {
			transform: scale(1) !important; /* Reset zoom for printing */
			width: 8.5in !important;
			height: 11in !important;
			margin: 0 !important;
			padding: 0 0.25in !important;
			overflow: hidden !important;
			background-color: white !important;
			box-shadow: none !important;
		}
		.dots {
			background-image: none !important;
		}
	}
</style>
