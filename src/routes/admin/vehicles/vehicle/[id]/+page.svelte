<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	const handleClose = () => {
		goto('/admin/vehicles');
	};

	// First, get the data
	export let data: PageData;

	// Then destructure or process it
	const { vehicle } = data;

	// Any other variables or reactive statements should come after

	// Function to get sorted images array with primary image first
	function getOrderedImages(vehicle: any) {
		if (!vehicle.images) return [];

		const stripVersionFromUrl = (url: string) => {
			if (!url) return '';
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
			.map((img: any) => (img?.imageUrl ? stripVersionFromUrl(img.imageUrl) : ''))
			.filter((url: string) => url !== '');

		return uniqueImages;
	}

	// Log the vehicle data when component mounts
	console.log('Vehicle data:', vehicle);
	console.log('Vehicle images:', vehicle?.images);
	const orderedImages = vehicle.images;
	console.log('Ordered images array length:', orderedImages.length);

	// Add state for current slide
	let currentSlide = 0;
	let api: any;

	// Function to handle thumbnail clicks
	const goToSlide = (index: number) => {
		api?.scrollTo(index);
		currentSlide = index;
	};

	// Handle slide changes from the carousel
	const handleSelect = (index: number) => {
		currentSlide = index;
	};
</script>

<div class="container my-10 py-10">
	{#if vehicle}
		<h1 class="my-5 w-full text-start text-4xl font-bold">{vehicle.title}</h1>

		<div class="grid grid-cols-6 gap-10">
			<div class="col-span-3 flex flex-col">
				{#if vehicle}
					<Carousel.Root {api} onSelect={handleSelect} class="rounded-lg border border-gray-500/25">
						<Carousel.Content>
							{#each orderedImages as imageUrl, index}
								<Carousel.Item>
									<img
										src={imageUrl}
										alt={`Vehicle view ${index + 1}`}
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
				<div class="my-1 grid grid-cols-6 gap-1 p-1 md:grid-cols-12 lg:grid-cols-12">
					{#if orderedImages && orderedImages.length > 0}
						{#each orderedImages as imageUrl, index}
							<button
								class="aspect-square overflow-hidden rounded-lg border {currentSlide === index
									? 'border-primary'
									: 'border-gray-500/25'}"
								on:click={() => goToSlide(index)}
							>
								<img
									src={imageUrl}
									alt={`Vehicle view ${index + 1}`}
									class="h-full w-full object-cover"
								/>
							</button>
						{/each}
					{:else}
						<div class="col-span-6">No images found</div>
					{/if}
				</div>
				<div class="col-span-3 overflow-hidden">
					{@html vehicle.description}
				</div>
			</div>

			{#if vehicle}
				<div class="col-span-3 ms-5 flex flex-col">
					<div class="rounded-lg border border-gray-500/25">
						<div class="text-md mb-1">
							<div
								class="text-md mb-1 flex items-center justify-between border-b border-gray-500/25 px-4 py-2 font-bold"
							>
								<span>Price:</span>
								<span>
									{#if vehicle.price}
										${(vehicle.price / 100).toLocaleString()}
									{:else}
										Not Available
									{/if}
								</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Stock Number:</span> <span>{vehicle.stockNumber}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Usage:</span> <span>{vehicle.usage}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Year:</span> <span>{vehicle.year}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Make:</span> <span>{vehicle.manufacturer}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Model:</span> <span>{vehicle.modelName}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Metric:</span> <span>{vehicle.metricValue}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Type:</span> <span>{vehicle.modelType}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>VIN:</span> <span>{vehicle.vin}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Condition:</span> <span>{vehicle.condition}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Type:</span> <span> {vehicle.modelType}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Trim:</span> <span>{vehicle.trimName}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>VIN:</span> <span>{vehicle.vin}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Condition:</span> <span>{vehicle.condition}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Location:</span> <span>{vehicle.location}</span>
							</div>
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Condition:</span> <span>{vehicle.condition}</span>
							</div>
							{#if vehicle.trimName}
								<div
									class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2"
								>
									<span>Trim:</span> <span>{vehicle.trimName}</span>
								</div>
							{/if}
							{#if vehicle.trimColor}
								<div
									class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2"
								>
									<span>Trim Color:</span> <span>{vehicle.trimColor}</span>
								</div>
							{/if}
							<div class="text-md mb-1 flex justify-between border-b border-gray-500/25 px-4 py-2">
								<span>Location:</span> <span>{vehicle.location}</span>
							</div>
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
