<script lang="ts">
	import type { PageData } from './$types';
	import { LayoutGrid, DatabaseZap, Tag, Tags, Image, User } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const data = $props<PageData>();

	console.log('Page component data:', data);

	// Create tweened stores for each stat
	const totalVehicles = tweened(0, {
		duration: 2000,
		easing: cubicOut
	});
	const totalNewVehicles = tweened(0, { duration: 2000, easing: cubicOut });
	const totalUsedVehicles = tweened(0, { duration: 2000, easing: cubicOut });
	const totalSoldVehicles = tweened(0, { duration: 2000, easing: cubicOut });

	onMount(() => {
		// Start the animation when component mounts
		totalVehicles.set(data.data.stats.totalVehicles);
		totalNewVehicles.set(data.data.stats.totalNewVehicles);
		totalUsedVehicles.set(data.data.stats.totalUsedVehicles);
		totalSoldVehicles.set(data.data.stats.totalSoldVehicles);
	});
</script>

<div class="container mx-auto my-10">
	<header class="my-8">
		<h1 class="text-3xl font-bold">Admin Dashboard</h1>
		<p class="text-gray-500">Manage your dealership tools and inventory</p>
	</header>

	<div
		class="xs:grid-cols-2 mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
	>
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
		>
			<div>
				<p class="font-semibold text-gray-500">Total Vehicles</p>
				<h2 class="text-5xl font-bold">{Math.round($totalVehicles)}</h2>
			</div>
		</a>
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div>
				<p class="font-semibold text-gray-500">New Vehicles</p>
				<h2 class="text-5xl font-bold">{Math.round($totalNewVehicles)}</h2>
			</div>
		</a>
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div>
				<p class="font-semibold text-gray-500">Used Vehicles</p>
				<h2 class="text-5xl font-bold">{Math.round($totalUsedVehicles)}</h2>
			</div>
		</a>
		<a
			href="/admin/vehicles"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div>
				<p class="font-semibold text-gray-500">Sold Vehicles</p>
				<h2 class="text-5xl font-bold">{Math.round($totalSoldVehicles)}</h2>
			</div>
		</a>
	</div>
	<!-- Three Column Section-->
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
