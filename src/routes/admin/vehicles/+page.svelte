<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import {
		CircleGauge,
		ImageOff,
		Tags,
		Camera,
		CameraOff,
		Tag,
		Frown,
		Share2,
		Settings,
		KeySquare,
		LayoutGrid,
		List,
		AlignLeft,
		CircleCheck
	} from 'lucide-svelte';
	import { page } from '$app/stores';

	const { data } = $props<{ data: PageData }>();
	const { supabase, session, vehicles } = $derived(data);

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

	// Load saved preferences
	if (typeof window !== 'undefined') {
		const savedView = localStorage.getItem('vehiclesViewMode') as 'grid' | 'list' | null;
		if (savedView === 'grid' || savedView === 'list') {
			viewMode = savedView;
		}
		const savedSort = localStorage.getItem('vehiclesSortMode') as SortOption | null;
		if (savedSort && sortOptions.some((opt) => opt.value === savedSort)) {
			selectedSort = savedSort;
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
	const filteredVehicles = $derived(
		vehicles
			? vehicles.filter((vehicle: Vehicle) => {
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

	// Group vehicles
	const groupedVehicles = $derived(
		filteredVehicles.reduce((groups: GroupedVehicles, vehicle: Vehicle) => {
			let key;
			switch (selectedSort) {
				case 'modelType':
					key = vehicle.type || 'Unspecified';
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
					key = 'Other';
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
</script>

<div class="container mx-auto mb-5 mt-24">
	<h1 class="text-3xl font-bold">Inventory</h1>
</div>

<!-- FILTER,SEARCH and Sort Bar -->
<div class="sticky top-14 z-50 my-0 w-full">
	<div class="container mx-auto">
		<div
			class="flex h-12 w-full flex-row items-center justify-between gap-2 rounded-md border border-gray-200/90 bg-gray-100/90 dark:border-gray-800/90 dark:bg-gray-900/90"
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
						{#each Object.entries(groupedVehicles) as [groupName]}
							<option value={groupName}>{groupName}</option>
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
<div class="container mx-auto my-1">
	{#each Object.entries(groupedVehicles) as [groupName, group] (groupName)}
		<div class="mb-0">
			<div class="flex items-center justify-between">
				<h2 id={`${groupName}`} class="mb-1 mt-5 line-clamp-1 pb-1 font-semibold">
					{groupName}
				</h2>
				{#if group.total > 5}
					<button
						onclick={() => {
							const updatedGroup = groupedVehicles[groupName];
							updatedGroup.expanded = !updatedGroup.expanded;
						}}
						class="text-sm text-blue-500 hover:text-blue-700"
					>
						{group.expanded ? 'Show Less' : `Show All (${group.total})`}
					</button>
				{/if}
			</div>

			{#if viewMode === 'grid'}
				<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each group.items.slice(0, group.expanded ? undefined : 5) as vehicle (vehicle.id)}
						<div
							class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-md dark:bg-gray-800/50"
						>
							<!-- Make the content wrapper a flex container with column direction -->
							<div class="flex h-full flex-col">
								<!-- Image section remains the same -->
								<div class="relative w-full pb-[66.25%]">
									{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image'}
										<img
											src={vehicle.primaryImage}
											alt={vehicle.title || ''}
											loading="lazy"
											class="absolute inset-0 h-full w-full object-cover"
										/>
									{:else}
										<div class="absolute inset-0 flex items-center justify-center bg-gray-100">
											<ImageOff class="h-12 w-12 text-gray-400" />
										</div>
									{/if}
								</div>

								<!-- Content section with flex-1 to take remaining space -->
								<div class="flex flex-1 flex-col p-4">
									<div class="h-12">
										<h3 class="mb-2 line-clamp-2 font-semibold leading-tight">
											{vehicle.title}
										</h3>
									</div>
									<div class="my-0">
										<p class="my-1 text-2xl font-bold text-green-600">
											{vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
										</p>
										<div class="flex flex-row items-center gap-1">
											{#if vehicle.usage === 'Used'}
												<div
													class="flex flex-row items-center rounded-sm bg-orange-500 px-2 py-1 text-sm font-bold text-gray-100"
												>
													<CircleGauge class="mx-1 h-4 w-4" />
													{vehicle.metricValue}
													<span class="mx-1 text-sm font-semibold text-gray-100"
														>{vehicle.metricType}</span
													>
												</div>
												<div
													class="rounded-sm bg-orange-500 px-2 py-1 text-sm font-bold text-gray-100"
												>
													{vehicle.usage}
												</div>
											{:else}
												<div
													class="flex flex-row items-center rounded-sm bg-blue-500 px-2 py-1 text-sm font-bold text-gray-100"
												>
													<CircleGauge class="mx-1 h-4 w-4" />
													{vehicle.metricValue}
													<span class="mx-1 text-sm font-semibold text-gray-100"
														>{vehicle.metricType}</span
													>
												</div>
												<div
													class="rounded-sm bg-blue-500 px-2 py-1 text-sm font-bold text-gray-100"
												>
													{vehicle.usage}
												</div>
											{/if}
										</div>
										<div class="text-sm text-gray-500">
											<p class="mt-2">Color:</p>
											<div class="h-8">
												<h5 class="my-1 line-clamp-2 font-bold leading-tight">
													{vehicle.color || 'N/A'}
												</h5>
											</div>
											<p class="text-sm text-gray-500">Stock #</p>
											<div class="text-md line-clamp-2 font-bold leading-tight text-foreground">
												{vehicle.stockNumber}
											</div>
											<div class="my-2 border-b pb-3 text-sm text-gray-500">VIN: {vehicle.vin}</div>
										</div>
									</div>

									<!-- Button container now sticks to bottom -->
									<div class="mt-auto flex gap-1 pt-3">
										<button
											type="button"
											onclick={() => goto(`/admin/vehicles/keytag/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="View Key Tag"
										>
											<KeySquare class="h-6 w-6" />
										</button>
										<button
											type="button"
											onclick={() => goto(`/admin/vehicles/hangtag/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="View Hang Tag"
										>
											<Tags class="h-6 w-6" />
										</button>
										<button
											type="button"
											onclick={() => goto(`/admin/vehicles/share/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="Share Vehicle"
										>
											<Share2 class="h-6 w-6" />
										</button>
										<button
											type="button"
											onclick={() => goto(`/admin/vehicles/vehicle/${vehicle.id}`)}
											class="flex flex-row items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="Edit Vehicle Details"
										>
											<Settings class="h-6 w-6" />
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					{#each group.items.slice(0, group.expanded ? undefined : 5) as vehicle (vehicle.id)}
						<div
							class="grid grid-cols-[96px_1fr_200px_auto] gap-4 overflow-hidden rounded bg-gray-100/50 p-2 shadow-md dark:bg-gray-800/50"
						>
							<!-- Column 1: Image -->
							<div class="relative flex-shrink-0">
								<div class="relative pb-[50%]">
									{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image'}
										<img
											src={vehicle.primaryImage}
											alt={vehicle.title || ''}
											loading="lazy"
											class="absolute inset-0 h-full w-full rounded object-cover"
										/>
									{:else}
										<div
											class="absolute inset-0 flex items-center justify-center rounded bg-gray-200"
										>
											<span class="text-gray-400">No Image</span>
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
							<div class="mr-2 flex items-center justify-end text-lg font-bold text-green-600">
								{vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
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
								<div class="flex items-center rounded-md bg-gray-700/75 px-2 py-1.5">
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
