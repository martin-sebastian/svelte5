<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	export let data: PageData;
	const { vehicle } = data;

	// Function to format description: strip HTML and format as single paragraph
	function formatDescription(html: string) {
		// First strip HTML
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		const text = tmp.textContent || tmp.innerText || '';

		// Replace line breaks and multiple spaces with comma + space
		return text
			.replace(/(\r\n|\n|\r)/gm, ', ') // Replace line breaks with comma
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.replace(/,\s*,/g, ',') // Replace multiple commas with single comma
			.replace(/\s*,\s*/g, ', ') // Ensure proper spacing around commas
			.trim();
	}

	// Generate sharing URLs
	function getSharingUrls() {
		if (!vehicle || !browser) return null;

		const currentUrl = window.location.href;

		return {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
			twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(vehicle.title)}`
		};
	}

	// Handle share button clicks
	function shareToSocial(url: string) {
		if (browser) {
			window.open(url, '_blank', 'width=600,height=400,resizable=yes');
		}
	}
</script>

<svelte:head>
	<title>{vehicle?.title || 'Vehicle Details'}</title>

	<!-- Enhanced Open Graph Tags -->
	<meta property="og:title" content={vehicle?.title || 'Vehicle Details'} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={vehicle?.link || ''} />
	<meta property="og:site_name" content="Your Dealership Name" />
	<meta property="og:locale" content="en_US" />

	{#if vehicle?.primaryImage}
		<meta property="og:image" content={vehicle.primaryImage} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content={vehicle.title} />
		<meta property="og:image:type" content="image/jpeg" />
	{/if}

	<meta property="og:description" content={vehicle ? formatDescription(vehicle.description) : ''} />

	<!-- Enhanced Twitter Card Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@YourTwitterHandle" />
	<meta name="twitter:title" content={vehicle?.title || 'Vehicle Details'} />
	<meta
		name="twitter:description"
		content={vehicle ? formatDescription(vehicle.description) : ''}
	/>
	{#if vehicle?.primaryImage}
		<meta name="twitter:image" content={vehicle.primaryImage} />
		<meta name="twitter:image:alt" content={vehicle.title} />
	{/if}
</svelte:head>

<!-- Social Media Preview Card -->
{#if vehicle}
	<div class="flex h-screen w-full flex-row items-center justify-center bg-background p-4">
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
					{formatDescription(vehicle.description)}
				</p>

				<!-- Footer -->
				<div class="mt-4 border-t pt-4">
					<!-- Info row -->
					<div class="mb-4 flex items-center justify-between text-xs text-gray-500">
						<div>Stock #{vehicle.stockNumber}</div>
						<div>{new Date().toLocaleDateString()}</div>
					</div>

					<!-- Share buttons -->
					{#if browser}
						<div class="flex gap-2">
							<button
								on:click={() => shareToSocial(getSharingUrls()?.facebook || '')}
								class="flex-1 rounded bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877F2]/90"
							>
								Share on Facebook
							</button>
							<button
								on:click={() => shareToSocial(getSharingUrls()?.twitter || '')}
								class="flex-1 rounded bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
							>
								Share on X
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-xl">Loading...</div>
	</div>
{/if}
