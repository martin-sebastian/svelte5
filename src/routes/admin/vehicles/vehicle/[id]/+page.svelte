<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	// ... existing imports and code ...

	const handleClose = () => {
		goto('/admin/vehicles');
	};

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	// First, get the data
	export let data: PageData;

	// Then destructure or process it
	const { vehicle } = data;

	// Any other variables or reactive statements should come after

	// Function to get sorted images array with primary image first
	function getOrderedImages(vehicle: any) {
		if (!vehicle.images) return [];

		const stripVersionFromUrl = (url: string) => {
			return url.split('?')[0];
		};

		// Create array of unique images, properly ordered
		const uniqueImages = vehicle.images
			.sort((a: any, b: any) => {
				// Primary images first
				if (a.isPrimary && !b.isPrimary) return -1;
				if (!a.isPrimary && b.isPrimary) return 1;
				// Then by sort order
				return (a.sortOrder || 0) - (b.sortOrder || 0);
			})
			.map((img: any) => stripVersionFromUrl(img.imageUrl))
			.filter((url: string, index: number, self: string[]) => self.indexOf(url) === index);

		return uniqueImages;
	}

	// Log the vehicle data when component mounts
	console.log('Vehicle data:', vehicle);
	const orderedImages = getOrderedImages(vehicle);
	console.log('Ordered images array length:', orderedImages.length);
</script>

<div class="container my-10 py-10">
{#if vehicle}
	<h1 class="mt-10 w-full text-start text-4xl font-bold">{vehicle.title}</h1>

	<div class="grid grid-cols-3 gap-10">
		<div class="col-span-2 flex flex-col">
			{#if vehicle}
				<Carousel.Root class="rounded-lg border border-gray-500/25">
					<Carousel.Content>
						{#each orderedImages as imageUrl}
							<Carousel.Item>
								<img
									src={imageUrl}
									alt="Vehicle"
									class="h-full w-full overflow-hidden rounded-lg object-cover"
								/>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			{:else}
				<div class="col-span-12">No vehicle images found</div>
			{/if}
			<div class="my-1 grid grid-cols-12 gap-1 p-1 md:grid-cols-12 lg:grid-cols-12">
				{#if vehicle.images && vehicle.images.length > 0}
					{#each getOrderedImages(vehicle) as imageUrl}
						<div class="aspect-square overflow-hidden rounded-lg border border-gray-500/25">
							<img src={imageUrl} alt="Vehicle" class="h-full w-full object-cover" />
						</div>
					{/each}
				{:else}
					<div class="col-span-12">No images found</div>
				{/if}
			</div>
			<div class="col-span-2 overflow-hidden">
				{@html vehicle.description}
			</div>
		</div>

		{#if vehicle}
			<div class="col-span-1 ms-5 flex flex-col">
				<div class="rounded-lg border border-gray-500/25">
					<div class="text-md mb-1">
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
		{/if}
	</div>
{:else}
	<p>Loading vehicle...</p>
{/if}
</div>
<div class="fixed bottom-4 right-4 flex gap-2">
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
</div>
