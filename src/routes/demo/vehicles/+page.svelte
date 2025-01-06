<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	// Add these debug logs
	console.log('Raw data:', data);
	console.log('Vehicles:', data?.vehicles);

	// Sorting options
	const sortOptions = [
		{ value: 'modelType', label: 'Model Type' },
		{ value: 'year', label: 'Year' },
		{ value: 'manufacturer', label: 'Manufacturer' },
		{ value: 'usage', label: 'Usage' }
	];

	let selectedSort = 'modelType';

	// First, let's handle all vehicles filtering
	let searchTerm = '';

	$: filteredVehicles = data?.vehicles
		? data.vehicles.filter((vehicle) => {
				if (!searchTerm) return true; // Show all vehicles when no search term
				const searchLower = searchTerm.toLowerCase();
				return (
					vehicle.manufacturer?.toLowerCase().includes(searchLower) ||
					vehicle.title?.toLowerCase().includes(searchLower) ||
					vehicle.year?.toString().includes(searchLower) ||
					vehicle.color?.toLowerCase().includes(searchLower) ||
					vehicle.vin?.toLowerCase().includes(searchLower) ||
					vehicle.modelType?.toLowerCase().includes(searchLower) ||
					vehicle.usage?.toLowerCase().includes(searchLower)
				);
			})
		: [];

	// Then group the filtered vehicles
	$: groupedVehicles = filteredVehicles.reduce(
		(groups, vehicle) => {
			let key;
			switch (selectedSort) {
				case 'modelType':
					key = vehicle.modelType || 'Unspecified';
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
		{} as Record<string, typeof data.vehicles>
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
	<h1 class="text-4xl font-bold">Vehicles</h1>
</div>
<div class="container sticky top-0 mx-auto my-1">
	<div
		class="mb-6 flex items-center justify-between rounded-lg border border-gray-400/25 bg-background p-2 py-1 backdrop:blur-sm"
	>
		<div class="flex items-center">
			<!-- Search input -->
			<input
				type="search"
				bind:value={searchTerm}
				placeholder="Filter vehicles..."
				class="w-full rounded-lg border border-gray-400/25 bg-background px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			/>
			<span class="mx-2 block w-full text-sm text-gray-500">
				Showing {totalShowing} of {data?.vehicles?.length || 0} vehicles
			</span>
		</div>

		<!-- Sort Dropdown -->
		<div class="flex items-center gap-2">
			<label for="sort" class="text-gray-400/50">Group by:</label>
			<select
				id="sort"
				bind:value={selectedSort}
				class="rounded-md border border-gray-400/50 bg-gray-100/50 px-3 py-1.5 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-800/50 dark:bg-gray-800/50"
			>
				{#each sortOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
<div class="container mx-auto my-2">
	{#each sortedGroups as [groupName, vehicles]}
		<div class="mb-8">
			<h2 class="mb-4 line-clamp-1 text-xl font-semibold">{groupName}</h2>
			<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{#each vehicles as vehicle}
					<div
						class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-md dark:bg-gray-800/50"
					>
						<!-- Image -->
						<div class="aspect-w-16 aspect-h-9">
							{#if vehicle.primaryImage}
								<img
									src={vehicle.primaryImage}
									alt={vehicle.title}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center bg-gray-200">
									<span class="text-gray-400">No Image</span>
								</div>
							{/if}
						</div>

						<!-- Content -->
						<div class="p-4">
							<div class="h-12">
								<h3 class="mb-2 line-clamp-2 font-semibold leading-tight">
									{vehicle.title}
								</h3>
							</div>
							<div class="my-0">
								<p class="text-lg font-bold text-green-600">
									${(vehicle.price / 100).toLocaleString()}
									<span class="mx-1 text-sm text-gray-500">
										{vehicle.usage || 'N/A'}
									</span>
								</p>
								<div class="text-sm text-gray-500">
									<p>{vehicle.manufacturer}</p>
									<p>{vehicle.color}</p>
									<p class="font-bold text-foreground">{vehicle.stockNumber}</p>
									<p class="hidden">{vehicle.vin}</p>
									<p class="hidden">{vehicle.modelType || 'N/A'}</p>
								</div>
							</div>

							<!-- New Footer with Buttons -->
							<div class="mt-4 flex gap-2">
								<button
									type="button"
									on:click={() => goto(`/demo/vehicles/keytag/${vehicle.stockNumber}`)}
									class="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
									aria-label="View Key Tag"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-tag"
										aria-hidden="true"
										><path
											d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
										/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg
									>
								</button>
								<button
									type="button"
									on:click={() => goto(`/demo/vehicles/share/${vehicle.stockNumber}`)}
									class="flex flex-row items-center rounded-md bg-gray-500 py-1.5 pe-3 ps-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
									aria-label="View Vehicle Details"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-badge-info mr-1"
										><path
											d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
										/><line x1="12" x2="12" y1="16" y2="12" /><line
											x1="12"
											x2="12.01"
											y1="8"
											y2="8"
										/></svg
									> Details
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
