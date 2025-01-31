<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutGrid, DatabaseZap, Tag, Image } from 'lucide-svelte';

	const { data } = $page;
</script>

<div class="container mx-auto my-10 p-10">
	<header class="mb-8">
		<h1 class="mb-2 text-3xl font-bold">Welcome {data.user.email}</h1>
		<h2 class="mb-2 text-xl font-bold">Admin Dashboard</h2>
		<p class="text-gray-500">Manage your dealership tools and inventory</p>
	</header>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
			<Tag class="h-8 w-8 text-purple-500" />
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
