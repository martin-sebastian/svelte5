<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// Sorting options
	const sortOptions = [
		{ value: 'modelType', label: 'Model Type' },
		{ value: 'year', label: 'Year' },
		{ value: 'manufacturer', label: 'Manufacturer' },
		{ value: 'usage', label: 'Usage' }
	];

	let selectedSort = 'modelType';

	// Function to group motorcycles by the selected sort criteria
	$: groupedMotorcycles = data.motorcycles.reduce(
		(groups, motorcycle) => {
			let key;
			switch (selectedSort) {
				case 'modelType':
					key = motorcycle.modelType || 'Unspecified';
					break;
				case 'year':
					key = motorcycle.year?.toString() || 'Unspecified Year';
					break;
				case 'manufacturer':
					key = motorcycle.manufacturer || 'Unspecified';
					break;
				case 'usage':
					key = motorcycle.usage || 'Unspecified';
					break;
				default:
					key = 'Other';
			}

			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(motorcycle);
			return groups;
		},
		{} as Record<string, typeof data.motorcycles>
	);

	// Sort the groups and their contents
	$: sortedGroups = Object.entries(groupedMotorcycles).sort(([keyA], [keyB]) => {
		if (selectedSort === 'year') {
			// Sort years in descending order (newest first)
			return parseInt(keyB) - parseInt(keyA);
		}
		return keyA.localeCompare(keyB);
	});
</script>

<div class="container mx-auto mt-16 p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-5xl font-bold">Vehicles</h1>

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

	{#each sortedGroups as [group, motorcycles]}
		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">{group}</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each motorcycles as motorcycle}
					<div class="overflow-hidden rounded-lg bg-gray-100/50 shadow-md dark:bg-gray-800/50">
						<!-- Image -->
						<div class="aspect-w-16 aspect-h-9">
							{#if motorcycle.primaryImage}
								<img
									src={motorcycle.primaryImage}
									alt={motorcycle.title}
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
								<h3 class="mb-2 font-semibold leading-tight">{motorcycle.title}</h3>
							</div>
							<div class="space-y-2">
								<p class="text-lg font-bold text-green-600">
									${(motorcycle.price / 100).toLocaleString()}
								</p>
								<div class="text-sm text-gray-500">
									<p>Make: {motorcycle.manufacturer}</p>
									<p>Color: {motorcycle.color}</p>
									<p>Stock #: {motorcycle.stockNumber}</p>
									<p>VIN: {motorcycle.vin}</p>
									<p>Type: {motorcycle.modelType || 'N/A'}</p>
									<p>Usage: {motorcycle.usage || 'N/A'}</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
