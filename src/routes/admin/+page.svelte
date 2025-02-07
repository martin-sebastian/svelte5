<script lang="ts">
	import type { PageData } from './$types';
	import { LayoutGrid, DatabaseZap, Tag, Tags, Image, User, CircleGauge } from 'lucide-svelte';

	const data = $props<PageData>();

	console.log('Page component data:', data);
</script>

<div class="container mx-auto my-10 p-10">
	<header class="my-8">
		<h1 class="text-3xl font-bold">Admin Dashboard</h1>
		<p class="text-gray-500">Manage your dealership tools and inventory</p>
	</header>

	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
		>
			<CircleGauge class="h-8 w-8 text-blue-500" />
			<div>
				<h1 class="text-3xl font-bold">{data.data.stats.totalVehicles}</h1>
				<p class="text-sm text-gray-500">Total Vehicles</p>
			</div>
		</div>

		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<CircleGauge class="h-8 w-8 text-blue-500" />
			<div>
				<h2 class="text-3xl font-bold">{data.data.stats.totalNewVehicles}</h2>
				<p class="text-sm text-gray-500">New Veicles</p>
			</div>
		</a>
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<CircleGauge class="h-8 w-8 text-blue-500" />
			<div>
				<h2 class="text-3xl font-bold">{data.data.stats.totalUsedVehicles}</h2>
				<p class="text-sm text-gray-500">Used Veicles</p>
			</div>
		</a>
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<CircleGauge class="h-8 w-8 text-blue-500" />
			<div>
				<h2 class="text-3xl font-bold">{data.data.stats.totalSoldVehicles}</h2>
				<p class="text-sm text-gray-500">Sold Veicles</p>
			</div>
		</a>
	</div>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<User class="h-8 w-8 text-blue-500" />
			<div>
				<h2 class="text-xl font-bold">Hello {data?.user?.email}</h2>
				<p class="text-sm text-gray-500">Manage and view your vehicle listings</p>
			</div>
		</a>

		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<LayoutGrid class="h-8 w-8 text-blue-500" />
			<div>
				<h2 class="text-xl font-semibold">Vehicle Inventory</h2>
				<p class="text-sm text-gray-500">Manage and view your vehicle listings</p>
			</div>
		</a>
		<a
			href="/admin/hangtags"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<Tag class="h-8 w-8 text-red-500" />
			<div>
				<h2 class="text-xl font-semibold">Hang Tags</h2>
				<p class="text-sm text-gray-500">Create and print your vehicle price tags</p>
			</div>
		</a>

		<a
			href="/admin/sync"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<DatabaseZap class="h-8 w-8 text-green-500" />
			<div>
				<h2 class="text-xl font-semibold">Sync Data</h2>
				<p class="text-sm text-gray-500">Synchronize inventory with Dealer Spike</p>
			</div>
		</a>

		<div
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<Tags class="h-8 w-8 text-purple-500" />
			<div>
				<h2 class="text-xl font-semibold">Key Tags</h2>
				<p class="text-sm text-gray-500">Generate and manage key tags</p>
			</div>
		</div>

		<div
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<Image class="h-8 w-8 text-orange-500" />
			<div>
				<h2 class="text-xl font-semibold">Social Media</h2>
				<p class="text-sm text-gray-500">Create and schedule social media posts</p>
			</div>
		</div>
	</div>
</div>

<pre class="hidden">Debug: {JSON.stringify(data, null, 2)}</pre>
