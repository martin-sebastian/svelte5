<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { vehiclesCache } from '$lib/stores/vehiclesCache';
	import { page } from '$app/stores';
	import {
		Tags,
		Camera,
		CameraOff,
		Frown,
		Share2,
		KeySquare,
		LayoutGrid,
		AlignLeft,
		CircleCheck
	} from 'lucide-svelte';
	import type { Vehicle } from '$lib/types/vehicle';

	// Type definitions for data structure returned from the server
	interface VehicleFromServer {
		id: string;
		title: string;
		stock_number: string | null;
		vin: string | null;
		manufacturer: string | null;
		year: number | null;
		color: string | null;
		model_type: string | null;
		usage: string | null;
		price: string | null;
		metric_value: number | null;
		metric_type: string | null;
		status: 'ACTIVE' | 'SOLD' | 'HIDDEN' | 'ARCHIVED';
		condition: string | null;
		primaryImage: string | null;
		imageCount: number;
		images: Array<{ id: string; image_url: string }>;
	}

	const { data } = $props<{ data: PageData }>();
	const { vehicles, modelTypes } = $derived(data);

	// Sorting options
	const sortOptions = [
		//{ value: '' as const, label: 'No Sort' },
		{ value: 'modelType' as const, label: 'Type ' },
		{ value: 'year' as const, label: 'Year ' },
		{ value: 'manufacturer' as const, label: 'Make ' },
		{ value: 'usage' as const, label: 'Usage ' }
	];

	// Initialize state variables
	let viewMode = $state<'grid' | 'list'>('grid');
	let selectedSort = $state<SortOption>('modelType');
	let searchTerm = $state('');
	let isLoading = $state(false);

	type SortOption = 'modelType' | 'year' | 'manufacturer' | 'usage' | '';

	// Load saved preferences
	if (typeof window !== 'undefined') {
		const savedView = localStorage.getItem('vehiclesViewMode') as 'grid' | 'list' | null;
		if (savedView === 'grid' || savedView === 'list') {
			viewMode = savedView;
		}
		const savedSort = localStorage.getItem('vehiclesSortMode') as SortOption | null;
		if (savedSort && sortOptions.some((opt) => opt.value === savedSort)) {
			selectedSort = savedSort;
		} else {
			selectedSort = 'modelType';
		}
	}

	// Save preferences when they change
	$effect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('vehiclesViewMode', viewMode);
			localStorage.setItem('vehiclesSortMode', selectedSort);
		}
	});

	// Format price helper
	function formatPrice(price: string | number | null) {
		if (!price) return 'N/A';
		const actualPrice = typeof price === 'string' ? parseFloat(price) / 100 : price / 100;
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(actualPrice);
	}

	// Filter and group vehicles
	const filteredVehicles = $derived(
		data.vehicles
			? data.vehicles.filter((vehicle: VehicleFromServer) => {
					if (!searchTerm) return true;
					const searchLower = searchTerm.toLowerCase();
					return (
						vehicle.stock_number?.toLowerCase().includes(searchLower) ||
						vehicle.title?.toLowerCase().includes(searchLower) ||
						vehicle.year?.toString().includes(searchLower) ||
						vehicle.manufacturer?.toLowerCase().includes(searchLower) ||
						vehicle.color?.toLowerCase().includes(searchLower) ||
						vehicle.vin?.toLowerCase().includes(searchLower)
					);
				})
			: []
	);

	type GroupedVehicles = Record<
		string,
		{
			items: VehicleFromServer[];
			total: number;
			expanded: boolean;
		}
	>;

	// Group vehicles using filteredVehicles
	const groupedVehicles = $derived(
		filteredVehicles.reduce((groups: GroupedVehicles, vehicle: VehicleFromServer) => {
			let key;
			switch (selectedSort) {
				case 'modelType':
					key = vehicle.model_type || 'Unspecified';
					break;
				case 'year':
					key = vehicle.year?.toString() || 'Unspecified Year';
					break;
				case 'manufacturer':
					key = vehicle.manufacturer || 'Unspecified';
					break;
				case 'usage':
					key = vehicle.usage || 'Unspecified';
					break;
				default:
					key = 'All Vehicles';
			}

			if (!groups[key]) {
				groups[key] = {
					items: [],
					total: 0,
					expanded: false
				};
			}

			groups[key].items.push(vehicle);
			groups[key].total++;

			return groups;
		}, {} as GroupedVehicles)
	);

	let imageError = $state<Record<string, boolean>>({});

	// Reset image errors when data changes
	$effect(() => {
		if (data?.vehicles) {
			imageError = {}; // Reset errors when data changes
		}
	});

	// Improved image error handling approach
	function handleImageError(vehicleId: string, url: string) {
		console.error('Image failed to load:', url, 'for vehicle:', vehicleId);
		imageError[vehicleId] = true;
	}

	$effect(() => {
		const images = document.querySelectorAll('img[data-vehicle-id]');
		images.forEach((img) => {
			const vehicleId = (img as HTMLImageElement).dataset.vehicleId;
			if (vehicleId) {
				(img as HTMLImageElement).onerror = () =>
					handleImageError(vehicleId, (img as HTMLImageElement).src);
			}
		});
	});

	// Make the groupedVehicles reactive with $state
	let groupExpanded = $state<Record<string, boolean>>({});

	// Function to toggle group expansion
	function toggleGroup(groupName: string) {
		console.log('Toggling group:', groupName, 'Current state:', groupExpanded[groupName]);
		groupExpanded[groupName] = !groupExpanded[groupName];
		console.log('New state:', groupExpanded[groupName]);
	}

	// Function to handle navigation to vehicles page
	async function navigateToVehicles() {
		const cachedData = vehiclesCache.getCached();
		if (cachedData) {
			// Use cached data immediately
			vehiclesCache.set(cachedData);
		}
		await goto('/admin/vehicles');
	}

	// After successful vehicle update/create/delete
	vehiclesCache.invalidate();

	// Debug images
	$effect(() => {
		if (data?.vehicles) {
			console.log('Sample vehicle data:', data.vehicles[0]);
			console.log('Primary image sample:', data.vehicles[0]?.primaryImage);
			console.log(
				'Images available:',
				data.vehicles.filter((v: VehicleFromServer) => v.primaryImage).length,
				'out of',
				data.vehicles.length
			);
		}
	});

	// Using static variables for the filter lists to avoid typing issues
	let uniqueYears = $state<number[]>([]);
	let uniqueMakes = $state<string[]>([]);
	let uniqueUsages = $state<string[]>([]);

	// Populate the filter lists when the data changes
	$effect(() => {
		if (data?.vehicles) {
			uniqueYears = Array.from(
				new Set(data.vehicles.map((v: VehicleFromServer) => v.year).filter(Boolean) as number[])
			).sort((a, b) => b - a);

			uniqueMakes = Array.from(
				new Set(
					data.vehicles.map((v: VehicleFromServer) => v.manufacturer).filter(Boolean) as string[]
				)
			).sort();

			uniqueUsages = Array.from(
				new Set(data.vehicles.map((v: VehicleFromServer) => v.usage).filter(Boolean) as string[])
			).sort();
		}
	});
</script>

<!-- FILTER,SEARCH and Sort Bar -->
<div class="fixed left-6 top-2 z-50 my-1 w-full">
	<div class="container mx-auto px-8">
		<div
			class="flex h-12 w-full flex-row items-center justify-between gap-2 rounded-md border border-gray-200/90 bg-background/90 shadow-sm backdrop-blur-lg dark:border-gray-800/90 dark:bg-gray-900/90 print:hidden"
		>
			<!-- Left section with dropdowns -->
			<div class="ml-2 flex w-1/4 items-center gap-2">
				<!-- Jump to dropdown -->
				<div class="flex flex-row items-center gap-2">
					<select
						onchange={(e: Event) => {
							const target = e.target as HTMLSelectElement;
							const groupName = target.value;
							if (!groupName) {
								window.scrollTo({ top: 0, behavior: 'smooth' });
								return;
							}
							const element = document.getElementById(groupName);
							if (element) {
								const navbarHeight = 64;
								const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
								window.scrollTo({ top: y, behavior: 'smooth' });
							}
						}}
						class="w-full rounded-full border border-gray-400/25 bg-gray-100/25 px-3 py-0.5 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-700/50 dark:bg-gray-800/50"
					>
						<option value="">Jump to...</option>
						{#if selectedSort === 'modelType'}
							{#each data.modelTypes as modelType}
								<option value={modelType.model_type}>{modelType.model_type}</option>
							{/each}
						{:else if selectedSort === 'year'}
							{#each uniqueYears as year}
								<option value={year}>{year}</option>
							{/each}
						{:else if selectedSort === 'manufacturer'}
							{#each uniqueMakes as make}
								<option value={make}>{make}</option>
							{/each}
						{:else if selectedSort === 'usage'}
							{#each uniqueUsages as usage}
								<option value={usage}>{usage}</option>
							{/each}
						{/if}
					</select>
				</div>
			</div>

			<!-- Center search input -->
			<div class="flex w-2/4 justify-center">
				<div class="relative w-full max-w-xl">
					<input
						type="search"
						bind:value={searchTerm}
						placeholder="Filter..."
						class="w-full rounded-full border border-gray-400/25 bg-background px-3 py-1 pr-20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					<div class="absolute right-2 top-1/2 flex -translate-y-1/2 flex-row items-center gap-2">
						<span
							class="my-2.5 rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						>
							{filteredVehicles?.length || 0}/{data?.vehicles?.length || 0}
						</span>
					</div>
				</div>
			</div>

			<!-- Right section with sort and view controls -->
			<div class="flex w-1/4 items-center justify-end gap-2">
				<!-- Sort Dropdown -->
				<select
					id="sort"
					bind:value={selectedSort}
					class="w-32 rounded-full border border-gray-400/25 bg-gray-100/50 px-3 py-0 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-700/50 dark:bg-gray-800/50"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>

				<!-- View toggle buttons -->
				<button
					class={`ml-2 rounded-full p-1 hover:bg-gray-200/50 ${
						viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''
					}`}
					onclick={() => (viewMode = 'grid')}
					aria-label="Grid view"
				>
					<LayoutGrid class="h-5 w-5" />
				</button>
				<button
					class={`mr-2 rounded-full p-1 hover:bg-gray-200/50 ${
						viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''
					}`}
					onclick={() => (viewMode = 'list')}
					aria-label="List view"
				>
					<AlignLeft class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Vehicle List -->
<div class="container mx-auto px-8 pt-[100px]">
	{#each Object.entries(groupedVehicles) as [groupName, group] (groupName)}
		{@const typedGroup = group as { items: VehicleFromServer[]; total: number; expanded: boolean }}
		<div class="mb-0">
			<div class="flex items-center justify-between">
				<h2 id={`${groupName}`} class="mb-1 mt-5 line-clamp-1 pb-1 font-semibold">
					{groupName}
				</h2>
				{#if selectedSort !== '' && typedGroup.items.length > 6}
					<button
						onclick={() => toggleGroup(groupName)}
						class="rounded-md border border-gray-500/50 bg-blue-400/50 px-4 py-1 text-xs text-gray-100/50 hover:text-blue-700 dark:bg-slate-600/50"
					>
						{groupExpanded[groupName] ? 'Show Less' : `Show All (${typedGroup.items.length})`}
					</button>
				{/if}
			</div>
			<!-- GRID VIEW -->
			{#if viewMode === 'grid'}
				<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
					{#each typedGroup.items.slice(0, selectedSort !== '' && !groupExpanded[groupName] ? 6 : undefined) as vehicle (vehicle.id)}
						<div
							class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-sm hover:shadow-md dark:bg-gray-800/50"
						>
							<!-- Image section -->
							<div class="relative">
								<div class="relative pb-[66.25%]">
									{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image' && !vehicle.primaryImage.includes('undefined') && !imageError[vehicle.id]}
										<img
											src={vehicle.primaryImage}
											alt={vehicle.title || 'Vehicle Image'}
											class="absolute inset-0 h-full w-full object-cover"
											data-vehicle-id={vehicle.id}
											onerror={() => handleImageError(vehicle.id, vehicle.primaryImage || '')}
										/>
									{:else}
										<div
											class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
										>
											<CameraOff class="h-12 w-12 text-gray-400" />
											{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image' && imageError[vehicle.id]}
												<div class="absolute bottom-1 left-1 text-[10px] text-gray-400">
													Failed to load: {vehicle.primaryImage.substring(0, 20)}...
												</div>
											{/if}
										</div>
									{/if}
								</div>
							</div>

							<!-- Status indicators -->
							<div class="mt-2 flex gap-1">
								<div class="ml-2 flex items-center rounded-md bg-gray-100/10 p-1">
									{#if vehicle.condition === 'Excellent'}
										<CircleCheck class="h-4 w-4 text-green-700" />
									{:else}
										<Frown class="h-4 w-4 text-gray-400" />
									{/if}
								</div>
								<div class="flex items-center rounded-md bg-gray-100/10 p-1">
									{#if vehicle.imageCount > 6}
										<Camera class="h-4 w-4 text-yellow-400" />
									{:else}
										<CameraOff class="h-4 w-4 text-gray-600" />
									{/if}
								</div>
							</div>

							<!-- Content section -->
							<div class="p-3">
								<!-- Title and basic info -->
								<h3 class="line-clamp-2 text-sm font-semibold">{vehicle.title || 'No Title'}</h3>
								<div class="mt-1 flex flex-col gap-0.5">
									<p class="text-xs text-gray-500">
										{vehicle.color || ''}
									</p>
									<p class="text-xs text-gray-500">
										Stock #{vehicle.stock_number || 'N/A'}
									</p>
									<p class="text-xs text-gray-500">
										VIN: {vehicle.vin || ''}
									</p>
								</div>

								<!-- Price -->
								<div class="mt-2 text-lg font-bold text-green-600">
									{vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
								</div>

								<!-- Action buttons -->
								<div class="mt-2 flex flex-wrap gap-1">
									<!-- Key Tag button -->
									<button
										type="button"
										onclick={() => goto(`/admin/vehicles/keytag/${vehicle.id}`)}
										class="rounded-md bg-gray-800 p-1.5 text-white hover:bg-gray-600"
										aria-label="View Key Tag"
									>
										<KeySquare class="h-4 w-4" />
									</button>

									<!-- Hang Tag button -->
									<button
										type="button"
										onclick={() => goto(`/admin/vehicles/hangtag/${vehicle.id}`)}
										class="rounded-md bg-gray-800 p-1.5 text-white hover:bg-gray-600"
										aria-label="View Hang Tag"
									>
										<Tags class="h-4 w-4" />
									</button>

									<!-- Share button -->
									<button
										type="button"
										onclick={() => goto(`/admin/vehicles/share/${vehicle.id}`)}
										class="rounded-md bg-gray-800 p-1.5 text-white hover:bg-gray-600"
										aria-label="Share Vehicle"
									>
										<Share2 class="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>
