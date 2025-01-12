<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { sanitizeHtml, stripHtmlAndFormatText } from '$lib/utils/sanitize';
	export let data: PageData;
	const { vehicle } = data;

	// Check if we have a valid vehicle
	$: hasValidVehicle = vehicle && Object.keys(vehicle).length > 0;

	// Generate sharing URLs
	function getSharingUrls() {
		if (!vehicle || !browser) return null;

		const currentUrl = window.location.href;
		const sanitizedDescription = browser ? stripHtmlAndFormatText(vehicle.description || '') : '';
		const smsText = `Check out this ${vehicle.title}: ${currentUrl}`;

		return {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(vehicle.title)}`,
			sms: `sms:?body=${encodeURIComponent(smsText)}`
		};
	}

	// Handle share button clicks
	function shareToSocial(url: string) {
		if (browser) {
			window.open(url, '_blank', 'width=600,height=400,resizable=yes');
		}
	}

	$: sanitizedDescription = browser ? sanitizeHtml(vehicle.description || '') : '';
	$: plainTextDescription = browser ? stripHtmlAndFormatText(vehicle.description || '') : '';
</script>

<svelte:head>
	{#if hasValidVehicle}
		<title>{vehicle.title || 'Vehicle Details'}</title>

		<!-- Enhanced Open Graph Tags -->
		<meta property="og:title" content={vehicle.title || 'Vehicle Details'} />
		<meta property="og:type" content="website" />
		<meta property="og:url" content={vehicle.link || ''} />
		<meta property="og:site_name" content="Your Dealership Name" />
		<meta property="og:locale" content="en_US" />

		{#if vehicle.primaryImage}
			<meta property="og:image" content={vehicle.primaryImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:image:alt" content={vehicle.title} />
			<meta property="og:image:type" content="image/jpeg" />
		{/if}

		<meta property="og:description" content={plainTextDescription} />

		<!-- Enhanced Twitter Card Tags -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@YourTwitterHandle" />
		<meta name="twitter:title" content={vehicle.title || 'Vehicle Details'} />
		<meta name="twitter:description" content={plainTextDescription} />
		{#if vehicle.primaryImage}
			<meta name="twitter:image" content={vehicle.primaryImage} />
			<meta name="twitter:image:alt" content={vehicle.title} />
		{/if}
	{:else}
		<title>Vehicle Not Found</title>
		<meta property="og:title" content="Vehicle Not Found" />
		<meta property="og:description" content="The requested vehicle could not be found." />
	{/if}
</svelte:head>

{#if hasValidVehicle}
	<div class="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
		<div class="w-[500px] overflow-hidden rounded-xl bg-white shadow-lg">
			<!-- Image Section -->
			{#if vehicle.primaryImage}
				<div class="relative h-[260px] w-full">
					<img src={vehicle.primaryImage} alt={vehicle.title} class="h-full w-full object-cover" />
					<!-- Optional: Price Badge -->
					{#if vehicle.price}
						<div
							class="absolute bottom-2 right-2 rounded-full bg-green-600 px-4 py-1 text-lg font-bold text-white"
						>
							${(vehicle.price / 100).toLocaleString()}
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
				<!-- Title -->
				<h1 class="mb-2 text-xl font-bold text-gray-900">{vehicle.title}</h1>

				<!-- Metrics -->
				<div class="mb-3 flex gap-2 text-sm text-gray-600">
					{#if vehicle.usage}<span>{vehicle.usage}</span>{/if}
					{#if vehicle.metricValue}<span>•</span><span
							>{vehicle.metricValue} {vehicle.metricType}</span
						>{/if}
				</div>

				<!-- Description -->
				<p class="text-sm text-gray-700">
					{#if browser}
						{@html sanitizedDescription}
					{:else}
						{@html vehicle.description || ''}
					{/if}
				</p>

				<!-- Footer -->
				<div class="mt-4 border-t pt-4">
					<!-- Info row -->
					<div class="mb-4 flex items-center justify-between text-xs text-gray-500">
						<div>Stock #{vehicle.stockNumber}</div>
						<div>{new Date().toLocaleDateString()}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-row items-center justify-center">
			<!-- Share buttons -->
			{#if browser}
				<div class="my-5 flex gap-2">
					<button
						on:click={() => shareToSocial(getSharingUrls()?.facebook || '')}
						class="flex-0 rounded bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877F2]/90"
					>
						Post to Meta
					</button>
					<button
						on:click={() => shareToSocial(getSharingUrls()?.twitter || '')}
						class="flex-0 rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
					>
						Post to X
					</button>
					<button
						on:click={() => shareToSocial(getSharingUrls()?.sms || '')}
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
