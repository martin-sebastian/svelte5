<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { CircleGauge } from 'lucide-svelte';
	import { ImageOff } from 'lucide-svelte';
	import { Tags } from 'lucide-svelte';
	import { Tag } from 'lucide-svelte';
	import { Share } from 'lucide-svelte';
	import { Share2 } from 'lucide-svelte';
	import { Settings } from 'lucide-svelte';
	import { KeySquare } from 'lucide-svelte';
	import { LayoutGrid } from 'lucide-svelte';
	import { List } from 'lucide-svelte';
	import { AlignLeft } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data: PageData;
	$: ({ supabase, session, vehicles } = data);

	// Sorting options
	const sortOptions = [
		{ value: 'modelType', label: 'Type ' },
		{ value: 'year', label: 'Year ' },
		{ value: 'manufacturer', label: 'Manufacturer ' },
		{ value: 'usage', label: 'Usage ' }
	];

	// Initialize without default values
	let viewMode: 'grid' | 'list';
	let selectedSort: string;

	// Load saved preferences on mount
	onMount(() => {
		// Load view mode preference
		const savedView = localStorage.getItem('vehiclesViewMode');
		viewMode = savedView === 'grid' || savedView === 'list' ? savedView : 'grid';

		// Load sort preference
		const savedSort = localStorage.getItem('vehiclesSortMode');
		selectedSort = savedSort || 'modelType'; // Default to 'modelType' if no preference
	});

	// Save user preferences
	$: {
		if (typeof window !== 'undefined') {
			if (viewMode) {
				localStorage.setItem('vehiclesViewMode', viewMode);
			}
			if (selectedSort) {
				localStorage.setItem('vehiclesSortMode', selectedSort);
			}
		}
	}

	// Filter vehicles
	let searchTerm = '';

	$: filteredVehicles = vehicles
		? vehicles.filter((vehicle) => {
				if (!searchTerm) return true; // Show all vehicles when no search term
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
		: [];

	// Then group the filtered vehicles
	$: groupedVehicles = filteredVehicles.reduce(
		(groups, vehicle) => {
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
				groups[key] = [];
			}
			groups[key].push(vehicle);
			return groups;
		},
		{} as Record<string, typeof vehicles>
	);

	// Sort the groups
	$: sortedGroups = Object.entries(groupedVehicles).sort(([keyA], [keyB]) => {
		if (selectedSort === 'year') {
			return parseInt(keyB) - parseInt(keyA);
		}
		return keyA.localeCompare(keyB);
	});

	$: totalShowing = filteredVehicles?.length || 0;
</script>

<div class="container mx-auto mt-24">
	<h1 class="text-3xl font-bold">Vehicles</h1>
</div>

<div class="container sticky top-0 z-50 mx-auto my-1">
	<div
		class="mb-6 flex flex-col gap-2 rounded-lg border border-gray-400/25 bg-background p-2 backdrop:blur-sm sm:flex-row sm:items-center sm:justify-between"
	>
		<!-- Search input and count - full width on mobile -->
		<div class="flex w-full flex-row items-center sm:w-auto">
			<input
				type="search"
				bind:value={searchTerm}
				placeholder="Filter..."
				class="w-full min-w-[350px] rounded-full border border-gray-800/25 bg-gray-300/25 px-4 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			/>
			<span class="ml-[-100px] mr-2 whitespace-nowrap text-sm text-gray-500">
				{totalShowing} of {data?.vehicles?.length || 0}
			</span>
		</div>

		<!-- Controls container - stack on mobile -->
		<div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
			<!-- Jump to dropdown -->
			<div class="w-full sm:w-auto">
				<select
					on:change={(e) => {
						const groupName = e.target.value;
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
					class="w-full rounded-full border border-gray-400/50 bg-gray-100/50 px-5 py-1 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-800/50 dark:bg-gray-800/50 sm:w-auto"
				>
					<option value="">Jump to...</option>
					{#each sortedGroups as [groupName]}
						<option value={groupName}>{groupName}</option>
					{/each}
				</select>
			</div>

			<!-- Sort Dropdown -->
			<div class="flex w-full items-center gap-2 sm:w-auto">
				<label for="sort" class="hidden text-gray-400/50 sm:block">Group by:</label>
				<select
					id="sort"
					bind:value={selectedSort}
					class="w-full rounded-full border border-gray-400/50 bg-gray-100/50 px-5 py-1 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-800/50 dark:bg-gray-800/50 sm:w-auto"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<!-- View toggle buttons -->
			<div class="flex flex-row items-center justify-end gap-2">
				<button
					class={`ml-4 rounded-full p-2 ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
					on:click={() => (viewMode = 'grid')}
					aria-label="Grid view"
				>
					<LayoutGrid class="h-5 w-5" />
				</button>
				<button
					class={`rounded-full p-2 ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
					on:click={() => (viewMode = 'list')}
					aria-label="List view"
				>
					<AlignLeft class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>
</div>
<div class="container mx-auto my-2">
	{#each sortedGroups as [groupName, vehicles]}
		<div class="mb-0">
			<h2
				id={`${groupName}`}
				class="mb-2 mt-0 line-clamp-1 border-b border-gray-400/25 pb-1 text-xl font-semibold"
			>
				{groupName}
			</h2>

			{#if viewMode === 'grid'}
				<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each vehicles as vehicle}
						<div
							class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-md dark:bg-gray-800/50"
						>
							<!-- Make the content wrapper a flex container with column direction -->
							<div class="flex h-full flex-col">
								<!-- Image section remains the same -->
								<div class="relative w-full pb-[66.25%]">
									{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image'}
										<img
											src={vehicle.primaryImage || ''}
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
										<p class="my-2 text-2xl font-bold text-green-600">
											{vehicle.price ? `$${(vehicle.price / 100).toLocaleString()}` : 'N/A'}
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
											<div class="border-t text-sm text-gray-500">VIN: {vehicle.vin}</div>
										</div>
									</div>

									<!-- Button container now sticks to bottom -->
									<div class="mt-auto flex gap-1 pt-3">
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/keytag/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="View Key Tag"
										>
											<KeySquare class="h-6 w-6" />
										</button>
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/hangtag/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="View Hang Tag"
										>
											<Tags class="h-6 w-6" />
										</button>
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/share/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="Share Vehicle"
										>
											<Share2 class="h-6 w-6" />
										</button>
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/vehicle/${vehicle.id}`)}
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
				<div class="flex flex-col gap-3">
					{#each vehicles as vehicle}
						<div
							class="flex overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 p-4 shadow-md dark:bg-gray-800/50"
						>
							<!-- Image thumbnail list view -->
							<div class="relative h-32 w-48 flex-shrink-0">
								{#if vehicle.primaryImage && vehicle.primaryImage !== 'https:Stock Image'}
									<img
										src={vehicle.primaryImage || ''}
										alt={vehicle.title || ''}
										loading="lazy"
										class="absolute inset-0 h-full w-full rounded-lg object-cover"
									/>
								{:else}
									<div
										class="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-200"
									>
										<span class="text-gray-400">No Image</span>
									</div>
								{/if}
							</div>

							<!-- Content list view -->
							<div class="flex flex-1 flex-col px-4">
								<div class="flex flex-row justify-between">
									<div class="text-lg font-semibold">{vehicle.title}</div>
									<div class="flex flex-row items-center gap-1">
										{#if vehicle.usage === 'Used'}
											<div
												class="flex flex-row items-center rounded-sm bg-orange-500 px-2 py-1 text-sm font-bold text-gray-100"
											>
												<CircleGauge class="mx-1 h-4 w-4" />
												{vehicle.metricValue}
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
											</div>
											<div class="rounded-sm bg-blue-500 px-2 py-1 text-sm font-bold text-gray-100">
												{vehicle.usage}
											</div>
										{/if}
									</div>
								</div>
								<div class="text-lg font-bold text-green-600">
									{vehicle.price ? `$${(vehicle.price / 100).toLocaleString()}` : 'N/A'}
								</div>
								<div class="text-sm text-gray-500">
									<div>{vehicle.manufacturer} • {vehicle.color}</div>
									<div class="text-sm text-gray-500">VIN: {vehicle.vin}</div>
								</div>

								<!-- Action buttons list view -->
								<div class="flex w-full flex-row items-center justify-between gap-1">
									<div class="text-lg font-bold text-gray-500">
										<h3 class="w-full text-lg font-bold text-gray-500">
											Stock # {vehicle.stockNumber}
										</h3>
									</div>
									<!-- Existing buttons list view -->
									<div class="flex flex-row items-center justify-end gap-1">
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/keytag/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="View Key Tag"
										>
											<KeySquare class="h-6 w-6" />
										</button>
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/hangtag/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="View Hang Tag"
										>
											<Tags class="h-6 w-6" />
										</button>
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/share/${vehicle.id}`)}
											class="flex flex-col items-center rounded-md bg-gray-500 p-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
											aria-label="Share Vehicle"
										>
											<Share2 class="h-6 w-6" />
										</button>
										<button
											type="button"
											on:click={() => goto(`/admin/vehicles/vehicle/${vehicle.id}`)}
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
			{/if}
		</div>
	{/each}
</div>
