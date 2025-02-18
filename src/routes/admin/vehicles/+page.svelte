<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { vehiclesCache } from '$lib/stores/vehiclesCache';
	import { page } from '$app/stores';
	import * as Drawer from '$lib/components/ui/drawer';
	import { KeyTag } from '$lib/components/keytag';
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
	import { setVehicleData } from '$lib/stores/keyTagState';
	import {
		keyTagDrawerState,
		openKeyTagDrawer,
		closeKeyTagDrawer
	} from '$lib/stores/keyTagDrawerState';

	let selectedVehicleId = $state<string | null>(null);

	// Extract vehicle ID and drawer state from URL
	const vehicleId = $derived($page.params.id || null);

	// Automatically open drawer when URL matches /vehicles/keytag/[id]?drawer=true
	$effect(() => {
		if (vehicleId && isDrawerOpen) {
			selectedVehicleId = vehicleId;
		} else {
			// Close drawer if URL doesn't match
			selectedVehicleId = null;
		}
	});

	// Add a cleanup effect for browser navigation
	$effect(() => {
		if (!$page.url.pathname.includes('/vehicles')) {
			selectedVehicleId = null;
		}
	});

	const { data } = $props<{ data: PageData }>();
	const { vehicles, modelTypes } = $derived(data);

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

	type SortOption = 'modelType' | 'year' | 'manufacturer' | 'usage' | '';

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

	// Add these derived values for different group options
	const uniqueYears = $derived(
		[...new Set(data.vehicles.map((v: Vehicle) => v.year))].filter(Boolean).sort((a, b) => b - a)
	);

	const uniqueMakes = $derived(
		[...new Set(data.vehicles.map((v: Vehicle) => v.manufacturer))].filter(Boolean).sort()
	);

	const uniqueUsages = $derived(
		[...new Set(data.vehicles.map((v: Vehicle) => v.usage))].filter(Boolean).sort()
	);

	// Add these at the top of your script
	const viewType = $derived($page.url.searchParams.get('view'));
	const viewId = $derived($page.url.searchParams.get('id'));

	// Add this effect to handle drawer state
	$effect(() => {
		if (viewType === 'keytag' && viewId) {
			selectedVehicleId = viewId;
		}
	});

	// When drawer opens with vehicle ID
	async function handleKeyTagOpen(vehicleId: string) {
		// This will use your existing Drizzle query in +page.server.ts
		const { data } = await goto(`/admin/vehicles/keytag/${vehicleId}`);
		setVehicleData(data.vehicle);
	}

	// Access state directly
	const isDrawerOpen = $derived(keyTagDrawerState.isOpen);
	const drawerVehicleId = $derived(keyTagDrawerState.vehicleId);
	const vehicle = $derived(keyTagState.vehicle);
</script>

<!-- FILTER,SEARCH and Sort Bar -->
<div class="fixed top-12 z-50 my-1 w-full">
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
							{#each data.modelTypes as { model_type }}
								<option value={model_type}>{model_type}</option>
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
		{@const typedGroup = group as { items: Vehicle[]; total: number; expanded: boolean }}
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
										Stock #{vehicle.stockNumber || 'N/A'}
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
									<!-- Original full page key tag button -->
									<button
										type="button"
										onclick={() => goto(`/admin/vehicles/keytag/${vehicle.id}`)}
										class="rounded-md bg-gray-800 p-1.5 text-white hover:bg-gray-600"
										aria-label="View Key Tag"
									>
										<KeySquare class="h-4 w-4" />
									</button>

									<!-- New drawer quick view button -->
									<button
										type="button"
										onclick={() => openKeyTagDrawer(vehicle.id)}
										class="rounded-md bg-blue-500 p-1.5 text-white hover:bg-blue-600"
										aria-label="Quick View Key Tag"
									>
										<KeySquare class="h-4 w-4" />
									</button>

									<button
										type="button"
										onclick={() => goto(`/admin/vehicles/hangtag/${vehicle.id}`)}
										class="rounded-md bg-gray-800 p-1.5 text-white hover:bg-gray-600"
										aria-label="View Hang Tag"
									>
										<Tags class="h-4 w-4" />
									</button>
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
