<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Tags,
		Camera,
		CameraOff,
		Frown,
		Share2,
		Settings,
		KeySquare,
		LayoutGrid,
		AlignLeft,
		CircleCheck
	} from 'lucide-svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const { data } = $props<{ data: PageData }>();
	const { user, vehicles, modelTypes } = $derived(data);

	// Add type definition for vehicle
	type Vehicle = {
		images: any;
		primaryImage: string | null;
		id: string;
		stockNumber: string | null;
		vin: string | null;
		year: number | null;
		manufacturer: string | null;
		type: string | null;
		style: string | null;
		title: string | null;
		color: string | null;
		usage: string | null;
		price: number | null;
		metricValue: string | null;
		metricType: string | null;
		status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
		imageCount: number;
		condition: string | null;
		model_type: string | null;
	};

	type SortOption = 'modelType' | 'year' | 'manufacturer' | 'usage';

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

	// Filter and group vehicles
	const filteredVehicles = $derived(
		data.vehicles
			? data.vehicles.filter((vehicle: Vehicle) => {
					if (!searchTerm) return true;
					const searchLower = searchTerm.toLowerCase();
					return (
						vehicle.stockNumber?.toLowerCase().includes(searchLower) ||
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
			items: Vehicle[];
			total: number;
			expanded: boolean;
		}
	>;

	// Group vehicles using filteredVehicles
	const groupedVehicles = $derived(
		filteredVehicles.reduce((groups: GroupedVehicles, vehicle: Vehicle) => {
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

	// Format price helper
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

	let imageError = $state<Record<string, boolean>>({});

	$effect(() => {
		const images = document.querySelectorAll('img');
		images.forEach((img) => {
			img.onerror = () => {
				const vehicleId = img.dataset.vehicleId;
				if (vehicleId) {
					imageError[vehicleId] = true;
				}
			};
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
</script>

<div class="my-2 w-full px-8 pt-10">
	<!-- Loading indicator for remaining cards -->
	{#if isLoading && data.vehicles.length > 0}
		<div class="rounded-md bg-orange-400/50 py-4 text-center text-sm uppercase text-foreground">
			Loading more inventory - {data.vehicles.length} items loaded
		</div>
	{/if}
</div>
<!-- FILTER,SEARCH and Sort Bar -->
<div class="sticky top-14 z-50 my-0">
	<div class="container mx-auto px-0">
		<div
			class="shadow-ms flex h-12 w-full flex-row items-center justify-between gap-2 rounded-md border border-gray-200/90 bg-gray-100/90 backdrop-blur-lg dark:border-gray-800/90 dark:bg-gray-900/90 print:hidden"
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
						class="w-full rounded-full border border-gray-400/75 bg-gray-100/75 px-3 py-0 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-700/50 dark:bg-gray-800/50"
					>
						<option value="">Jump to...</option>
						{#each data.modelTypes as { model_type }}
							<option value={model_type}>{model_type}</option>
						{/each}
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
					<div class="absolute right-2 top-1/2 -translate-y-1/2">
						<span
							class="my-2 rounded-full bg-gray-200 px-1 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
					class="w-32 rounded-full border border-gray-400/50 bg-gray-100/50 px-3 py-0 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-700/50 dark:bg-gray-800/50"
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
<div class="container mx-auto px-1">
	{#each Object.entries(groupedVehicles) as [groupName, group] (groupName)}
		<div class="mb-0">
			<div class="flex items-center justify-between">
				<h2 id={`${groupName}`} class="mb-1 mt-5 line-clamp-1 pb-1 font-semibold">
					{groupName}
				</h2>
				{#if selectedSort !== '' && group.items.length > 6}
					<button
						onclick={() => toggleGroup(groupName)}
						class="text-sm text-blue-500 hover:text-blue-700"
					>
						{groupExpanded[groupName] ? 'Show Less' : `Show All (${group.items.length})`}
					</button>
				{/if}
			</div>

			{#if viewMode === 'grid'}
				<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
					{#each group.items.slice(0, selectedSort !== '' && !groupExpanded[groupName] ? 6 : undefined) as vehicle (vehicle.id)}
						<div
							class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-md dark:bg-gray-800/50"
						>
							<!-- Image section -->
							<div class="relative">
								<div class="relative pb-[66.25%]">
									{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image'}
										<img
											src={vehicle.primaryImage}
											alt={vehicle.title}
											class="absolute inset-0 h-full w-full object-cover"
											data-vehicle-id={vehicle.id}
											style={imageError[vehicle.id] ? 'display: none;' : ''}
										/>
										<div
											class="absolute inset-0 items-center justify-center bg-gray-100 dark:bg-gray-800"
											style={imageError[vehicle.id] ? 'display: flex;' : 'display: none;'}
											transition:fade
										>
											<CameraOff class="h-12 w-12 text-gray-400" />
										</div>
									{:else}
										<div
											class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
											transition:fade
										>
											<CameraOff class="h-12 w-12 text-gray-400" />
										</div>
									{/if}
								</div>
							</div>
							<!-- Status indicators -->
							<div class="z-[100] ml-3 mt-[5px] flex gap-1">
								<div class="flex items-center p-1">
									{#if vehicle.condition === 'Excellent'}
										<CircleCheck class="h-4 w-4 text-green-700" />
									{:else}
										<Frown class="h-4 w-4 text-gray-400" />
									{/if}
								</div>
								<div class="flex items-center p-1">
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
										{vehicle.color ? `• ${vehicle.color}` : ''}
									</p>
									<p class="text-xs text-gray-500">
										Stock #{vehicle.stockNumber || 'N/A'}
									</p>
									<p class="text-xs text-gray-500">
										VIN: {vehicle.vin ? vehicle.vin.slice(-6) : 'N/A'}
									</p>
									<p class="text-xs text-gray-500">
										{vehicle.manufacturer || ''}
									</p>
								</div>

								<!-- Price -->
								<div class="mt-2 text-lg font-bold text-green-600">
									{vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
								</div>

								<!-- Action buttons -->
								<div class="mt-2 flex flex-wrap gap-0">
									<Button variant="ghost" href="/admin/vehicles/keytag/{vehicle.id}">
										<KeySquare class="h-4 w-4" />
									</Button>
									<Button variant="ghost" href="/admin/vehicles/hangtag/{vehicle.id}">
										<Tags class="h-4 w-4" />
									</Button>
									<Button variant="ghost" href="/admin/vehicles/share/{vehicle.id}">
										<Share2 class="h-4 w-4" />
									</Button>
									<Button variant="ghost" href="/admin/vehicles/vehicle/{vehicle.id}">
										<Settings class="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- List View -->
				<div class="flex flex-col gap-2">
					{#each group.items.slice(0, selectedSort === '' ? undefined : group.expanded ? undefined : 8) as vehicle (vehicle.id)}
						<div
							class="grid grid-cols-[96px_1fr_200px_auto] gap-4 overflow-hidden rounded bg-gray-100/50 p-2 shadow-md dark:bg-gray-800/50"
						>
							<!-- Column 1: Image -->
							<div class="relative flex-shrink-0">
								<div class="relative pb-[50%]">
									{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image'}
										<img
											src={vehicle.primaryImage}
											alt={vehicle.title}
											class="absolute inset-0 h-full w-full object-cover"
											data-vehicle-id={vehicle.id}
											style={imageError[vehicle.id] ? 'display: none;' : ''}
										/>
										<div
											class="absolute inset-0 items-center justify-center bg-gray-100 dark:bg-gray-800"
											style={imageError[vehicle.id] ? 'display: flex;' : 'display: none;'}
											transition:fade
										>
											<CameraOff class="h-12 w-12 text-gray-400" />
										</div>
									{:else}
										<div
											class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
											transition:fade
										>
											<CameraOff class="h-12 w-12 text-gray-400" />
										</div>
									{/if}
								</div>
							</div>

							<!-- Column 2: Title and Details -->
							<div class="flex flex-col">
								<div class="text-lg font-semibold">{vehicle.title}</div>
								<div class="text-sm text-gray-500">
									Stock # {vehicle.stockNumber} | {vehicle.color} | VIN: {vehicle.vin}
								</div>
							</div>

							<!-- Column 3: Price (fixed width) -->
							<div class="mx-8 flex items-center justify-end border-r-[5px] border-green-800">
								<h3 class="p-4 text-lg font-bold text-gray-100">
									{vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
								</h3>
							</div>

							<!-- Column 4: Action Buttons -->
							<div class="flex items-center gap-1">
								<div class="flex items-center rounded-md bg-gray-700/75 px-2 py-1.5">
									{#if vehicle.condition === 'Excellent'}
										<CircleCheck class="h-7 w-7 text-green-700" />
									{:else}
										<Frown class="h-7 w-7 text-gray-400" />
									{/if}
								</div>
								<div class="mr-4 flex items-center rounded-md bg-gray-700/75 px-2 py-1.5">
									{#if vehicle.imageCount > 6}
										<Camera class="h-7 w-7 text-yellow-400" />
									{:else}
										<CameraOff class="h-7 w-7 text-gray-600" />
									{/if}
								</div>
								<button
									type="button"
									onclick={() => goto(`/admin/vehicles/keytag/${vehicle.id}`)}
									class="flex items-center rounded-md bg-gray-800 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
									aria-label="View Key Tag"
								>
									<KeySquare class="h-6 w-6" />
								</button>
								<button
									type="button"
									onclick={() => goto(`/admin/vehicles/hangtag/${vehicle.id}`)}
									class="flex items-center rounded-md bg-gray-800 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
									aria-label="View Hang Tag"
								>
									<Tags class="h-6 w-6" />
								</button>
								<button
									type="button"
									onclick={() => goto(`/admin/vehicles/share/${vehicle.id}`)}
									class="flex items-center rounded-md bg-gray-800 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
									aria-label="Share Vehicle"
								>
									<Share2 class="h-6 w-6" />
								</button>
								<button
									type="button"
									onclick={() => goto(`/admin/vehicles/vehicle/${vehicle.id}`)}
									class="flex items-center rounded-md bg-gray-800 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
									aria-label="Edit Vehicle Details"
								>
									<Settings class="h-6 w-6" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<!-- Loading indicator -->
{#await data.vehiclesPromise}
	<div class="loading-skeleton container mx-auto my-4 px-8">
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
			{#each Array(16) as _}
				<div
					class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-md dark:bg-gray-800/50"
				>
					<!-- Image section with correct aspect ratio -->
					<div class="relative w-full animate-pulse bg-gray-200 pb-[66.25%]"></div>

					<!-- Content section -->
					<div class="flex flex-col space-y-3 p-4">
						<!-- Title placeholder -->
						<div class="h-12">
							<div class="mb-2 h-4 animate-pulse rounded bg-gray-200"></div>
							<div class="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
						</div>

						<!-- Price placeholder -->
						<div class="h-8 w-1/2 animate-pulse rounded bg-gray-200"></div>

						<!-- Usage badges placeholder -->
						<div class="flex gap-1">
							<div class="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
							<div class="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
						</div>

						<!-- Details placeholder -->
						<div class="space-y-2">
							<div class="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
							<div class="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
							<div class="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
						</div>

						<!-- Buttons placeholder -->
						<div class="mt-auto flex gap-1 pt-3">
							{#each Array(4) as _}
								<div class="h-10 w-10 animate-pulse rounded-md bg-gray-200"></div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{:then _}
	<!-- Your existing grouped vehicles display using groupedVehicles -->
	{#each Object.entries(groupedVehicles) as [groupName, group] (groupName)}
		<!-- Your existing group display code -->
	{/each}
{:catch error}
	<div class="error">
		{error.message}
	</div>
{/await}

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
