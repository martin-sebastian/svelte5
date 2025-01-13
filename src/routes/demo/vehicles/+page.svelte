<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	// Add these debug logs
	console.log('Raw data:', data);
	console.log('Vehicles:', data?.vehicles);

	// Sorting options
	const sortOptions = [
		{ value: 'modelType', label: 'Type ' },
		{ value: 'year', label: 'Year ' },
		{ value: 'manufacturer', label: 'Make ' },
		{ value: 'usage', label: 'Usage ' }
	];

	let selectedSort = 'modelType';

	// First, let's handle all vehicles filtering
	let searchTerm = '';

	$: filteredVehicles = data?.vehicles
		? data.vehicles.filter((vehicle) => {
				if (!searchTerm) return true; // Show all vehicles when no search term
				const searchLower = searchTerm.toLowerCase();
				return (
					vehicle.stockNumber?.toLowerCase().includes(searchLower) ||
					vehicle.make?.toLowerCase().includes(searchLower) ||
					vehicle.title?.toLowerCase().includes(searchLower) ||
					vehicle.year?.toString().includes(searchLower) ||
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
					key = vehicle.make || 'Unspecified';
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

	// Add view state
	let viewMode: 'grid' | 'list' = 'grid';
</script>

<div class="container mx-auto mt-24">
	<h1 class="text-3xl font-bold">Vehicles</h1>
</div>

<div class="container sticky top-0 z-50 mx-auto my-1">
	<div
		class="mb-6 flex items-center justify-between rounded-lg border border-gray-400/25 bg-background px-2 py-2 backdrop:blur-sm"
	>
		<div class="flex flex-row items-center">
			<!-- Search input -->
			<input
				type="search"
				bind:value={searchTerm}
				placeholder="Filter..."
				class=" rounded-full border border-gray-800/25 bg-gray-300/25 px-4 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			/>
			<span class="mx-2 block w-full text-sm text-gray-500">
				{totalShowing} of {data?.vehicles?.length || 0}
			</span>
		</div>
		<!-- Scroll to type anchor -->
		<div class="flex flex-row items-center">
			<select
				on:change={(e) => {
					const groupName = e.target.value;
					const element = document.getElementById(groupName);
					if (element) {
						const navbarHeight = 64;
						const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
						window.scrollTo({ top: y, behavior: 'smooth' });
					}
				}}
				class="rounded-full border border-gray-400/50 bg-gray-100/50 px-5 py-1 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-800/50 dark:bg-gray-800/50"
			>
				<option value="">Jump to...</option>
				{#each sortedGroups as [groupName]}
					<option value={groupName}>{groupName}</option>
				{/each}
			</select>
		</div>

		<!-- Sort Dropdown -->
		<div class="flex items-center gap-2">
			<label for="sort" class="text-gray-400/50">Group by:</label>
			<select
				id="sort"
				bind:value={selectedSort}
				class="rounded-full border border-gray-400/50 bg-gray-100/50 px-5 py-1 shadow-sm focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-gray-800/50 dark:bg-gray-800/50"
			>
				{#each sortOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<!-- Add view toggle buttons -->
		<div class="flex items-center gap-2">
			<button
				class={`rounded-full p-2 ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
				on:click={() => (viewMode = 'grid')}
				aria-label="Grid view"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect width="7" height="7" x="3" y="3" rx="1" />
					<rect width="7" height="7" x="14" y="3" rx="1" />
					<rect width="7" height="7" x="14" y="14" rx="1" />
					<rect width="7" height="7" x="3" y="14" rx="1" />
				</svg>
			</button>
			<button
				class={`rounded-full p-2 ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
				on:click={() => (viewMode = 'list')}
				aria-label="List view"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			</button>
		</div>
	</div>
</div>
<div class="container mx-auto my-2">
	{#each sortedGroups as [groupName, vehicles]}
		<div class="mb-8">
			<h2
				id={`${groupName}`}
				class="mb-2 mt-5 line-clamp-1 border-b border-gray-400/25 pb-1 text-xl font-semibold"
			>
				{groupName}
			</h2>

			{#if viewMode === 'grid'}
				<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each vehicles as vehicle}
						<div
							class="block w-full overflow-hidden rounded-lg border border-gray-400/25 bg-gray-100/50 shadow-md dark:bg-gray-800/50"
						>
							<!-- Image -->
							<div class="relative w-full pb-[66.25%]">
								{#if vehicle.images[0]}
									<img
										src={vehicle.images[0]}
										alt={vehicle.title}
										class="absolute inset-0 h-full w-full object-cover"
									/>
								{:else}
									<div class="absolute inset-0 flex items-center justify-center bg-gray-200">
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
									<p class="mt-2 text-lg font-bold text-green-600">
										{vehicle.price ? `$${(vehicle.price / 100).toLocaleString()}` : 'N/A'}
										<span class="mx-1 text-sm text-gray-500">
											{vehicle.usage || 'N/A'}
										</span>
									</p>
									<div class="text-sm text-gray-500">
										<p>{vehicle.make}</p>
										<div class="h-12">
											<h5 class="my-1 line-clamp-2 font-semibold leading-tight">{vehicle.color}</h5>
										</div>
										<p class="">VIN:{vehicle.vin}</p>
									</div>
								</div>

								<!-- New Footer with Buttons -->
								<div class="mt-4 flex gap-1">
									<button
										type="button"
										on:click={() => goto(`/demo/vehicles/keytag/${vehicle.id}`)}
										class="flex flex-col items-center rounded-md bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
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
										on:click={() => goto(`/demo/vehicles/hangtag/${vehicle.id}`)}
										class="flex flex-col items-center rounded-md bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
										aria-label="View Hang Tag"
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
											class="lucide lucide-tags"
											><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" /><path
												d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"
											/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor" /></svg
										>
									</button>
									<button
										type="button"
										on:click={() => goto(`/demo/vehicles/share/${vehicle.id}`)}
										class="flex flex-col items-center rounded-md bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
										aria-label="Share Vehicle"
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
											class="lucide lucide-share"
											><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline
												points="16 6 12 2 8 6"
											/><line x1="12" x2="12" y1="2" y2="15" /></svg
										>
									</button>
									<button
										type="button"
										on:click={() => goto(`/demo/vehicles/vehicle/${vehicle.id}`)}
										class="flex flex-row items-center rounded-md bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
										aria-label="Edit Vehicle Details"
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
											class="lucide lucide-settings-2"
											><path d="M20 7h-9" /><path d="M14 17H5" /><circle
												cx="17"
												cy="17"
												r="3"
											/><circle cx="7" cy="7" r="3" /></svg
										> <span class="q me-1 ms-1 text-sm">Edit</span>
									</button>
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
							<!-- Image thumbnail -->
							<div class="relative h-32 w-48 flex-shrink-0">
								{#if vehicle.images[0]}
									<img
										src={vehicle.images[0]}
										alt={vehicle.title}
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

							<!-- Content -->
							<div class="flex flex-1 flex-col px-4">
								<h3 class="text-lg font-semibold">{vehicle.title}</h3>
								<p class="text-lg font-bold text-green-600">
									{vehicle.price ? `$${(vehicle.price / 100).toLocaleString()}` : 'N/A'}
									<span class="mx-1 text-sm text-gray-500">{vehicle.usage || 'N/A'}</span>
								</p>
								<div class="text-sm text-gray-500">
									<p>{vehicle.make} • {vehicle.color}</p>
									<p>VIN: {vehicle.vin}</p>
								</div>

								<!-- Action buttons -->
								<div class="mt-auto flex gap-1 pt-2">
									<!-- Existing buttons -->
									<button
										type="button"
										on:click={() => goto(`/demo/vehicles/keytag/${vehicle.id}`)}
										class="flex flex-col items-center rounded-md bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
									>
										<!-- ... existing button content ... -->
									</button>
									<!-- ... other buttons ... -->
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>
