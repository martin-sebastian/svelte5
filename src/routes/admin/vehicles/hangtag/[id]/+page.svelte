<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { CircleDashed, X, Printer, ZoomOut, ZoomIn } from 'lucide-svelte';
	import type { QRCodeToDataURLOptions } from 'qrcode';
	import QRCode from 'qrcode';
	import { browser } from '$app/environment';

	const { data } = $props<{ data: PageData }>();
	const { vehicle } = $derived(data);

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

	let qrCodeDataUrl = $state<string | null>(null);

	$effect(() => {
		if (browser && vehicle) {
			const url = `${window.location.origin}/vehicles/share/${vehicle.id}`;
			const options: QRCodeToDataURLOptions = {
				width: 200,
				margin: 1,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			};

			QRCode.toDataURL(url, options)
				.then((dataUrl: string) => {
					qrCodeDataUrl = dataUrl;
				})
				.catch((err: Error) => {
					console.error('Error generating QR code:', err);
				});
		}
	});

	const handleClose = () => {
		goto('/admin/vehicles');
	};

	function formatPrice(price: number | null) {
		if (!price) return 'N/A';
		const actualPrice = price / 100;
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(actualPrice);
	}
</script>

{#if vehicle}
	<div class="fixed bottom-4 right-4 flex gap-2 print:hidden">
		<button
			type="button"
			onclick={handleClose}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Close and return to vehicles"
		>
			<X class="h-6 w-6" />
		</button>
		<button
			type="button"
			onclick={handlePrint}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Print hangtag"
		>
			<Printer class="h-6 w-6" />
		</button>
		<button
			type="button"
			onclick={zoomOut}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom out"
		>
			<ZoomOut class="h-6 w-6" />
		</button>
		<button
			type="button"
			onclick={zoomIn}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom in"
		>
			<ZoomIn class="h-6 w-6" />
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
								{formatPrice(vehicle.price)}
							{:else}
								Not Available
							{/if}
						</div>
						<div
							class="fixed bottom-0 right-0 z-10 mx-auto my-0 w-1/2 bg-red-800 p-6 text-center text-[44pt] font-bold text-white"
						>
							{#if vehicle.price}
								{formatPrice(vehicle.price)}
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
