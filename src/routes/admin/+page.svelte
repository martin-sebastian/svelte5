<script lang="ts">
	import type { PageData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		LayoutGrid,
		DatabaseZap,
		Tag,
		Tags,
		Image,
		Gauge,
		Users,
		CircleGauge
	} from 'lucide-svelte';
	import type { User } from '@supabase/supabase-js';

	const { data } = $props();
	const { stats, user: currentUser } = $derived(data);

	// Function to get user initials
	function getUserInitials(user: User | null): string {
		if (!user) return '?';

		const firstName = user.user_metadata?.first_name || '';
		const lastName = user.user_metadata?.last_name || '';

		if (firstName && lastName) {
			return `${firstName[0]}${lastName[0]}`.toUpperCase();
		}

		return user.email?.[0]?.toUpperCase() || '?';
	}
</script>

<div class="container mx-auto my-2 p-10">
	<header class="my-2 flex items-center gap-4">
		<Avatar.Root>
			<Avatar.Image
				src={currentUser?.user_metadata?.avatar_url || '/favicon.png'}
				alt="User avatar"
			/>
			<Avatar.Fallback>
				{getUserInitials(currentUser)}
			</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex flex-col">
			<h1 class="text-3xl font-bold">Admin Dashboard</h1>
			<p class="text-gray-500">Manage your dealership operations based on your inventory</p>
		</div>
	</header>
	<div class="grid grid-cols-1 gap-6 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
		<a href="/admin/vehicles" aria-label="Total Vehicles">
			<div
				class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-6 py-2 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="w-full text-right">
					<h2 class="text-8xl font-black text-gray-500">{stats.totalVehicles}</h2>
					<div class="flex flex-row text-2xl text-gray-500">
						<Gauge class="mr-2 h-8 w-8" /> Total Vehicles
					</div>
				</div>
			</div>
		</a>
		<a href="/admin/vehicles" aria-label="New Vehicles">
			<div
				class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-6 py-2 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="w-full text-right">
					<h2 class="text-8xl font-black text-blue-500">{stats.totalNewVehicles}</h2>
					<div class="flex flex-row text-2xl text-blue-500">
						<Gauge class="mr-2 h-8 w-8" /> New Veicles
					</div>
				</div>
			</div>
		</a>
		<a href="/admin/vehicles" aria-label="Total Used Vehicles">
			<div
				class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-6 py-2 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="w-full pr-4 text-right">
					<h2 class="text-8xl font-black text-orange-500">{stats.totalUsedVehicles}</h2>

					<div class="flex flex-row text-2xl text-orange-500">
						<Gauge class="mr-2 h-8 w-8" /> Used Veicles
					</div>
				</div>
			</div>
		</a>

		<a
			href="/admin/vehicles"
			aria-label="Vehicle Inventory"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-4">
				<LayoutGrid class="h-8 w-8 text-blue-500" />
				<div>
					<h2 class="text-xl font-semibold">Vehicle Inventory</h2>
					<div class="text-md text-gray-500">Manage and view your vehicle listings</div>
				</div>
			</div>
		</a>

		<a
			href="/admin/vehicles"
			aria-label="Key Tags"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-4">
				<Tags class="h-8 w-8 text-purple-500" />
				<div>
					<h2 class="text-xl font-semibold">Key Tags</h2>
					<div class="text-md text-gray-500">Generate and manage key tags</div>
				</div>
			</div>
		</a>

		<a
			href="/admin/vehicles"
			aria-label="Hang Tags"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-4">
				<Tag class="h-8 w-8 text-red-500" />
				<div>
					<h2 class="text-xl font-semibold">Hang Tags</h2>
					<div class="text-md text-gray-500">Create and print your vehicle price tags</div>
				</div>
			</div>
		</a>

		<a
			href="/admin/sync"
			aria-label="Sync Data"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-4">
				<DatabaseZap class="h-8 w-8 text-green-500" />
				<div>
					<h2 class="text-xl font-semibold">Sync Data</h2>
					<div class="text-md text-gray-500">Synchronize inventory with Dealer Spike</div>
				</div>
			</div>
		</a>

		<a
			href="/admin/vehicles"
			aria-label="Social Media"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-4">
				<Image class="h-8 w-8 text-orange-500" />
				<div>
					<h2 class="text-xl font-semibold">Social Media</h2>
					<div class="text-md text-gray-500">Create and schedule social media posts</div>
				</div>
			</div>
		</a>

		<!-- User Management -->
		<a
			href="/admin/users"
			aria-label="User Management"
			class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="flex items-center gap-4">
				<Users class="h-8 w-8 text-blue-500" />
				<div>
					<h2 class="text-xl font-semibold">User Management</h2>
					<div class="text-md text-gray-500">Manage and view your vehicle listings</div>
				</div>
			</div>
		</a>
	</div>
</div>

<pre class="hidden">Debug: {JSON.stringify(stats, null, 2)}</pre>

{#if import.meta.env.DEV}
	<div class="container mx-auto my-8 px-8">
		<details class="rounded-lg border p-4">
			<summary class="cursor-pointer text-sm font-medium">Debug: Session Info</summary>
			<pre class="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(data.session, null, 2)}</pre>
		</details>
	</div>
{/if}
