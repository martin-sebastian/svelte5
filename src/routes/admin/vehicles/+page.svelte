<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import {
		CameraOff,
		Frown,
		Share2,
		Settings,
		LayoutGrid,
		AlignLeft,
		SortAsc,
		SortDesc,
		Loader2
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	// Instead of destructuring directly from data
	const { data } = $props();
	// Create a local state for vehicles
	let vehiclesList = $state(data.vehicles);
	const { modelTypes, user } = data;

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
	let isLoadingMore = $state(false);

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

	// Filter vehicles
	const filteredVehicles = $derived(vehiclesList);

	type GroupedVehicles = Record<
		string,
		{
			items: Vehicle[];
			total: number;
			expanded: boolean;
		}
	>;

	// Group vehicles using filteredVehicles
	const groupedVehicles = $derived(() => {
		const groups = filteredVehicles.reduce((groups: GroupedVehicles, vehicle: Vehicle) => {
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
		}, {} as GroupedVehicles);

		// Sort the keys if we're grouping by year
		if (selectedSort === 'year') {
			return Object.fromEntries(
				Object.entries(groups).sort(([a], [b]) => {
					if (a === 'Unspecified Year') return 1;
					if (b === 'Unspecified Year') return -1;
					return Number(b) - Number(a);
				})
			);
		}

		return groups;
	});

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

	let state = $state({
		search: data.filters.search,
		modelType: data.filters.modelType,
		sortBy: data.filters.sortBy,
		sortOrder: data.filters.sortOrder,
		page: data.pagination.page
	});

	// Replace the lodash import with this custom debounce function
	function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
		let timeoutId: ReturnType<typeof setTimeout>;

		return function (...args: Parameters<T>) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		};
	}

	// Debounced search that triggers server-side filtering
	const debouncedSearch = debounce(async (term: string) => {
		const url = new URL(window.location.href);
		if (term) {
			url.searchParams.set('search', term);
		} else {
			url.searchParams.delete('search');
		}
		url.searchParams.set('page', '1');
		await goto(url, { replaceState: true });
	}, 300);

	$effect(() => {
		if (searchTerm !== data.filters?.search) {
			debouncedSearch(searchTerm);
		}
	});

	function handleSort(column: string) {
		if (state.sortBy === column) {
			state.sortOrder = state.sortOrder === 'ASC' ? 'DESC' : 'ASC';
		} else {
			state.sortBy = column;
			state.sortOrder = 'DESC';
		}
		state.page = 1;
	}

	// Define sortable columns without 'as const'
	const sortableColumns = [
		{ key: 'manufacturer', label: 'Manufacturer' },
		{ key: 'model_type', label: 'Type' },
		{ key: 'year', label: 'Year' },
		{ key: 'price', label: 'Price' },
		{ key: 'status', label: 'Status' }
	];

	// Replace the current loading state with this
	let showLoading = $state(false);
	let loadingTimeout: NodeJS.Timeout;

	$effect(() => {
		if ($navigating) {
			// Only show loading for navigation that changes search params
			if ($navigating.to?.url.search !== $page.url.search) {
				loadingTimeout = setTimeout(() => {
					showLoading = true;
				}, 150);
			}
		}

		return () => {
			clearTimeout(loadingTimeout);
			showLoading = false;
		};
	});

	// Load more function
	async function loadMore() {
		if (isLoadingMore) return;

		try {
			isLoadingMore = true;
			const nextPage = data.pagination.page + 1;

			const url = new URL(window.location.href);
			url.searchParams.set('page', nextPage.toString());

			const response = await fetch(url);
			const newData = await response.json();

			// Update local state
			vehiclesList = [...vehiclesList, ...newData.vehicles];

			// Update pagination data
			data.pagination = newData.pagination;

			window.history.replaceState({}, '', url);
		} catch (error) {
			console.error('Error loading more vehicles:', error);
		} finally {
			isLoadingMore = false;
		}
	}

	let loadMoreRef: HTMLDivElement;

	$effect(() => {
		if (!loadMoreRef) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && data.pagination.hasMore && !isLoadingMore) {
					loadMore();
				}
			},
			{ rootMargin: '100px' }
		);

		observer.observe(loadMoreRef);

		return () => observer.disconnect();
	});
</script>

<!-- Optimized loading indicator -->
{#if showLoading}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-background/60"
		in:fade={{ duration: 100 }}
		out:fade={{ duration: 100 }}
	>
		<div class="flex items-center gap-2">
			<Loader2 class="h-8 w-8 animate-spin" />
		</div>
	</div>
{/if}

<div class="my-2 w-full px-8 pt-10">
	<!-- Loading indicator for remaining cards -->
	{#if isLoading && vehiclesList?.length > 0}
		<div class="rounded-md bg-orange-400/50 py-4 text-center text-sm uppercase text-foreground">
			Loading more inventory - {vehiclesList.length} items loaded
		</div>
	{/if}
</div>

<!-- FILTER,SEARCH and Sort Bar -->
<div class="sticky top-14 z-50 my-3">
	<div class="container mx-auto px-8">
		<div
			class="flex flex-row items-center justify-between gap-2 rounded-md border border-gray-300/90 bg-gray-100/90 py-2 backdrop-blur-lg dark:border-gray-800/90 dark:bg-gray-900/90 print:hidden"
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
						{#each modelTypes as { model_type }}
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
						placeholder="Search vehicles..."
						class="pl-10"
						bind:value={searchTerm}
					/>
					<div class="absolute right-2 top-1/2 -translate-y-1/2">
						<span
							class="my-2 rounded-full bg-gray-200 px-1 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						>
							{filteredVehicles?.length || 0}/{vehiclesList?.length || 0}
						</span>
					</div>
				</div>
			</div>

			<!-- Right section with view toggle -->
			<div class="mr-2 flex w-1/4 items-center justify-end gap-2">
				<button
					class="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 {viewMode === 'grid'
						? 'bg-gray-200 dark:bg-gray-700'
						: ''}"
					onclick={() => (viewMode = 'grid')}
				>
					<LayoutGrid class="h-5 w-5" />
				</button>
				<button
					class="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 {viewMode === 'list'
						? 'bg-gray-200 dark:bg-gray-700'
						: ''}"
					onclick={() => (viewMode = 'list')}
				>
					<AlignLeft class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Vehicle Grid/List View -->
<div class="container mx-auto px-8">
	{#if vehiclesList && vehiclesList.length > 0}
		{#if viewMode === 'grid'}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each vehiclesList as vehicle (vehicle.id)}
					<div
						class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
					>
						<!-- Vehicle Image -->
						<div class="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
							{#if vehicle.primaryImage && !imageError[vehicle.id]}
								<img
									src={vehicle.primaryImage}
									alt={vehicle.title || 'Vehicle'}
									data-vehicle-id={vehicle.id}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700"
								>
									<CameraOff class="h-12 w-12 text-gray-400 dark:text-gray-500" />
								</div>
							{/if}
						</div>

						<!-- Vehicle Info -->
						<div class="flex flex-1 flex-col p-4">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{vehicle.title || 'Untitled Vehicle'}
							</h3>
							<div class="mt-1 flex flex-wrap gap-2">
								{#if vehicle.year}
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									>
										{vehicle.year}
									</span>
								{/if}
								{#if vehicle.manufacturer}
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									>
										{vehicle.manufacturer}
									</span>
								{/if}
								{#if vehicle.model_type}
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									>
										{vehicle.model_type}
									</span>
								{/if}
							</div>
							<div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
								{#if vehicle.stockNumber}
									<p>Stock #: {vehicle.stockNumber}</p>
								{/if}
								{#if vehicle.vin}
									<p>VIN: {vehicle.vin}</p>
								{/if}
								{#if vehicle.price !== null}
									<p class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(vehicle.price)}
									</p>
								{/if}
							</div>
						</div>

						<!-- Action Buttons -->
						<div
							class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50"
						>
							<a
								href="/admin/vehicles/{vehicle.id}"
								class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							>
								View Details
							</a>
							<div class="flex items-center gap-2">
								<button
									class="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Share2 class="h-4 w-4" />
								</button>
								<button
									class="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Settings class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each vehiclesList as vehicle (vehicle.id)}
					<div
						class="group flex items-center gap-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
					>
						<!-- Vehicle Image -->
						<div class="relative h-24 w-36 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
							{#if vehicle.primaryImage && !imageError[vehicle.id]}
								<img
									src={vehicle.primaryImage}
									alt={vehicle.title || 'Vehicle'}
									data-vehicle-id={vehicle.id}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700"
								>
									<CameraOff class="h-8 w-8 text-gray-400 dark:text-gray-500" />
								</div>
							{/if}
						</div>

						<!-- Vehicle Info -->
						<div class="flex flex-1 flex-col">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{vehicle.title || 'Untitled Vehicle'}
							</h3>
							<div class="mt-1 flex flex-wrap gap-2">
								{#if vehicle.year}
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									>
										{vehicle.year}
									</span>
								{/if}
								{#if vehicle.manufacturer}
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									>
										{vehicle.manufacturer}
									</span>
								{/if}
								{#if vehicle.model_type}
									<span
										class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									>
										{vehicle.model_type}
									</span>
								{/if}
							</div>
							<div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
								{#if vehicle.stockNumber}
									<span class="mr-4">Stock #: {vehicle.stockNumber}</span>
								{/if}
								{#if vehicle.vin}
									<span>VIN: {vehicle.vin}</span>
								{/if}
							</div>
							{#if vehicle.price !== null}
								<p class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
									{formatPrice(vehicle.price)}
								</p>
							{/if}
						</div>

						<!-- Action Buttons -->
						<div class="flex items-center gap-2 pr-4">
							<a
								href="/admin/vehicles/{vehicle.id}"
								class="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
							>
								View Details
							</a>
							<button
								class="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							>
								<Share2 class="h-4 w-4" />
							</button>
							<button
								class="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							>
								<Settings class="h-4 w-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="flex flex-col items-center justify-center py-12">
			<Frown class="h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No vehicles found</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Try adjusting your search or filter criteria
			</p>
		</div>
	{/if}
</div>

<!-- Remove or conditionally render the table view -->
{#if viewMode === 'table'}
	<div class="rounded-lg border">
		<table class="w-full">
			<thead>
				<tr class="border-b">
					{#each sortableColumns as column}
						<th class="p-4 text-left">
							<button
								class="flex items-center gap-2 hover:text-primary"
								onclick={() => handleSort(column.key)}
							>
								{column.label}
								{#if state.sortBy === column.key}
									{#if state.sortOrder === 'ASC'}
										<SortAsc class="h-4 w-4" />
									{:else}
										<SortDesc class="h-4 w-4" />
									{/if}
								{/if}
							</button>
						</th>
					{/each}
					<th class="p-4 text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if vehiclesList.length === 0}
					<tr>
						<td colspan="6" class="p-8 text-center text-muted-foreground"> No vehicles found </td>
					</tr>
				{:else}
					{#each vehiclesList as vehicle}
						<tr class="border-b hover:bg-muted/50">
							<td class="p-4">{vehicle.manufacturer || 'N/A'}</td>
							<td class="p-4">{vehicle.model_type || 'N/A'}</td>
							<td class="p-4">{vehicle.year || 'N/A'}</td>
							<td class="p-4">{vehicle.price ? formatPrice(vehicle.price) : 'N/A'}</td>
							<td class="p-4">
								<span
									class={`rounded-full px-2 py-1 text-xs font-medium ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''} ${vehicle.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : ''} ${vehicle.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-800' : ''}`}
								>
									{vehicle.status}
								</span>
							</td>
							<td class="p-4 text-right">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/admin/vehicles/{vehicle.id}"
										class="text-sm font-medium text-primary hover:underline"
									>
										View Details
									</a>
									<Button variant="ghost" size="icon">
										<Share2 class="h-4 w-4"></Share2>
									</Button>
									<Button variant="ghost" size="icon">
										<Settings class="h-4 w-4"></Settings>
									</Button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/if}

<div class="my-8 flex justify-center">
	{#if data.pagination.hasMore}
		<Button variant="outline" size="lg" on:click={loadMore} disabled={isLoadingMore}>
			{isLoadingMore ? 'Loading...' : 'Load More'}
		</Button>
	{/if}
</div>

<!-- Intersection Observer Target -->
<div bind:this={loadMoreRef} class="h-10"></div>

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
