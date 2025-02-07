<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { sanitizeHtml } from '$lib/utils/sanitize';
	import { ZoomIn, ZoomOut, X } from 'lucide-svelte';

	const { data } = $props<{ data: PageData }>();
	const { vehicle } = $derived(data);

	const hasValidVehicle = $derived(!!vehicle);
	const sanitizedDescription = $derived(
		browser && vehicle?.description ? sanitizeHtml(vehicle.description) : ''
	);

	const plainTextDescription = $derived(
		browser && vehicle?.description ? sanitizeHtml(vehicle.description) : ''
	);

	// Reactive meta values
	const pageTitle = $derived(vehicle?.title || 'Vehicle Details');
	const pageUrl = $derived(browser ? window.location.href : '');
	const siteName = 'Your Dealership Name'; // You can make this dynamic from your config
	const twitterHandle = '@YourTwitterHandle'; // Your actual Twitter handle

	// Enhanced OG description with more details
	const ogDescription = $derived(vehicle ? constructOgDescription(vehicle) : 'Vehicle Not Found');

	// Image dimensions - useful for social sharing
	const imageWidth = 1200;
	const imageHeight = 630;

	// Add zoom functionality
	let scale = $state(1);

	const zoomIn = () => (scale = Math.min(scale + 0.1, 3));
	const zoomOut = () => (scale = Math.max(scale - 0.1, 0.5));

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

	// Generate sharing URLs
	function generateSharingUrls() {
		if (!browser || !vehicle) return null;

		const currentUrl = window.location.href;
		const sanitizedText = browser ? sanitizeHtml(vehicle.description || '') : '';
		const smsText = `Check out this ${vehicle.title}: ${currentUrl}`;

		return {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
				currentUrl
			)}&text=${encodeURIComponent(`Check out this ${vehicle.title}`)}`,
			email: `mailto:?subject=${encodeURIComponent(
				`Check out this ${vehicle.title}`
			)}&body=${encodeURIComponent(`${sanitizedText}\n\n${currentUrl}`)}`,
			sms: `sms:?&body=${encodeURIComponent(smsText)}`
		};
	}

	const sharingUrls = $derived(generateSharingUrls());

	function shareToSocial(url: string) {
		if (!url) return;
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	const handleClose = () => {
		goto('/admin/vehicles');
	};

	function constructOgDescription(vehicle: any): string {
		const parts = [
			vehicle.vin ? `VIN: ${vehicle.vin}` : null,
			vehicle.stockNumber ? `Stock #${vehicle.stockNumber}` : null,
			vehicle.usage,
			vehicle.condition,
			vehicle.metricValue && vehicle.metricType
				? `${vehicle.metricValue} ${vehicle.metricType}`
				: null,
			vehicle.price ? formatPrice(vehicle.price) : null
		];

		return parts.filter(Boolean).join(' | ');
	}

	function calculateMonthlyPayment(price: number, months = 72, apr = 9.99): string {
		const principal = price / 100; // Convert cents to dollars
		const rate = apr / 100 / 12; // Convert APR to monthly rate
		const payment =
			(principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(payment);
	}
</script>

<svelte:head>
	{#if hasValidVehicle}
		<!-- Basic Meta Tags -->
		<title>{pageTitle}</title>
		<meta name="description" content={ogDescription} />

		<!-- Open Graph Tags -->
		<meta property="og:title" content={pageTitle} />
		<meta property="og:description" content={ogDescription} />
		<meta property="og:type" content="website" />
		<meta property="og:url" content={pageUrl} />
		<meta property="og:site_name" content={siteName} />
		<meta property="og:locale" content="en_US" />

		{#if vehicle.images?.[0]?.url}
			<meta property="og:image" content={vehicle.images[0].url} />
			<meta property="og:image:width" content={imageWidth.toString()} />
			<meta property="og:image:height" content={imageHeight.toString()} />
			<meta property="og:image:alt" content={pageTitle} />
			<meta property="og:image:type" content="image/jpeg" />

			<meta name="twitter:image" content={vehicle.images[0].url} />
			<meta name="twitter:image:alt" content={pageTitle} />
		{/if}

		<!-- Twitter Card Tags -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content={twitterHandle} />
		<meta name="twitter:title" content={pageTitle} />
		<meta name="twitter:description" content={ogDescription} />

		<!-- Additional Meta Tags for Rich Sharing -->
		<meta name="author" content={siteName} />
		<meta name="robots" content="index, follow" />
		{#if vehicle.price}
			<meta property="product:price:amount" content={(vehicle.price / 100).toString()} />
			<meta property="product:price:currency" content="USD" />
		{/if}
	{:else}
		<title>Vehicle Not Found</title>
		<meta property="og:title" content="Vehicle Not Found" />
		<meta property="og:description" content="The requested vehicle could not be found." />
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

{#if hasValidVehicle}
	<div class="dots flex h-screen w-full flex-col items-center justify-center bg-background p-4">
		<button
			type="button"
			onclick={() => (window.location.href = vehicle.link)}
			onkeydown={(e) => e.key === 'Enter' && (window.location.href = vehicle.link)}
			class="w-[600px] overflow-hidden rounded-xl border border-gray-400/25 bg-white text-start shadow-lg"
			style:transform="scale({scale})"
			style:transform-origin="center"
		>
			<!-- Image Section -->
			{#if vehicle.images?.[0]?.url}
				<div class="relative h-[300px] w-full">
					<img
						src={vehicle.images[0].url}
						alt={vehicle.title}
						class="h-full w-full rounded-t-xl object-cover"
					/>
					<!-- Optional: Price Badge -->
					{#if vehicle.price}
						<div
							class="absolute bottom-2 right-2 rounded-full bg-green-600 px-4 py-1 text-xl font-bold text-white"
						>
							{formatPrice(vehicle.price)}
							<span class="text-xs font-bold text-black">
								or {calculateMonthlyPayment(vehicle.price)}/mo.
							</span>
						</div>
					{/if}
				</div>
			{:else}
				<div class="flex h-[260px] w-full items-center justify-center bg-gray-200">
					<span class="text-gray-400">No Image Available</span>
				</div>
			{/if}

			<!-- Content Section -->
			<div class="p-4">
				<!-- Metrics -->
				<div class="mb-0 flex gap-1 text-sm font-bold text-gray-900">
					{#if vehicle.usage}<span>{vehicle.usage}</span>{/if}
					{#if vehicle.metricValue}<span>{vehicle.metricValue} {vehicle.metricType}</span>{/if}
				</div>
				<!-- Title -->
				<h1 class="mb-1 text-2xl font-bold text-gray-900">{vehicle.title}</h1>
				<p class="text-sm text-gray-900">
					{#if vehicle.price}
						<div class="mb-1 font-bold text-gray-600">
							Price: {formatPrice(vehicle.price)} |
							{#if vehicle.price && vehicle.price > 0 && vehicle.price !== undefined}
								Est. {calculateMonthlyPayment(vehicle.price)}/mo at 9.99% APR for 72 months
							{/if}
						</div>
					{/if}
				</p>

				<!-- Description -->
				<p class="line-clamp-6 text-sm text-gray-900">
					{#if browser}
						{@html sanitizedDescription}
					{:else}
						{@html vehicle.description || ''}
					{/if}
				</p>
				<p class="text-sm text-gray-900">
					VIN: {vehicle.vin}
				</p>

				<!-- Footer -->
				<div class="mt-4 border-t pt-4">
					<!-- Info row -->
					<div class="mb-2 flex items-center justify-between text-sm text-gray-500">
						<div>Location: {vehicle.location}</div>
						<div>{new Date().toLocaleDateString()}</div>
					</div>
				</div>
			</div>
		</button>
		<div class="flex flex-row items-center justify-center">
			<!-- Share buttons -->
			{#if browser}
				<div class="my-5 flex gap-2">
					<button
						onclick={() => shareToSocial(sharingUrls?.facebook || '')}
						class="flex-0 rounded bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877F2]/90"
					>
						Post to Meta
					</button>
					<button
						onclick={() => shareToSocial(sharingUrls?.twitter || '')}
						class="flex-0 rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
					>
						Post to X
					</button>
					<button
						onclick={() => shareToSocial(sharingUrls?.email || '')}
						class="flex-0 rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
					>
						Email
					</button>
					<button
						onclick={() => shareToSocial(sharingUrls?.sms || '')}
						class="flex-0 rounded bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
					>
						Paste as SMS
					</button>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex h-screen flex-col items-center justify-center gap-4">
		<div class="text-xl">Vehicle Not Found</div>
		<p class="text-gray-600">The requested vehicle could not be found.</p>
		<a href="/demo/vehicles" class="text-blue-600 hover:underline"> Return to Vehicle Listing </a>
	</div>
{/if}
<div class="fixed bottom-4 right-4 flex gap-2">
	<button
		onclick={handleClose}
		class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
		aria-label="Close and return to vehicles"
	>
		<X class="h-6 w-6" />
	</button>
	<button
		onclick={zoomOut}
		class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
		aria-label="Zoom out"
	>
		<ZoomOut class="h-6 w-6" />
	</button>
	<button
		onclick={zoomIn}
		class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
		aria-label="Zoom in"
	>
		<ZoomIn class="h-6 w-6" />
	</button>
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
