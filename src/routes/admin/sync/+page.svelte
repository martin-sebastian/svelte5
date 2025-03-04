<script lang="ts">
	import type { PageServerData } from './$types';
	import { Loader, DatabaseZap, AlertCircle, CheckCircle2, Store, User } from 'lucide-svelte';
	import { writable, get } from 'svelte/store';
	import { onMount } from 'svelte';

	// Replace $props with standard Svelte props
	export let data: PageServerData;

	// Replace $state with writable stores
	const isLoading = writable(false);
	const importMessage = writable('');
	const syncProgress = writable<null | {
		added: number;
		updated: number;
		markedAsSold: number;
		imagesAdded: number;
		attributesAdded: number;
		currentBatch: number;
		totalBatches: number;
		totalItems: number;
		processedItems: number;
		startTime: number;
		estimatedTimeRemaining: number | null;
		logs: string[];
	}>(null);
	const progressInterval = writable<number | null>(null);
	const showTerminal = writable(false);
	const customerData = writable<any>(null);
	const autoScroll = writable(true);

	// Format seconds to minutes and seconds
	function formatTime(seconds: number | null): string {
		if (seconds === null) return 'Calculating...';
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	}

	// Calculate percentage complete
	function getPercentComplete(): number {
		const progress = get(syncProgress);
		if (!progress || progress.totalItems === 0) return 0;
		return Math.round((progress.processedItems / progress.totalItems) * 100);
	}

	// Toggle terminal visibility
	function toggleTerminal() {
		showTerminal.update((value) => !value);
	}

	// Fetch customer data
	async function fetchCustomerData() {
		try {
			const response = await fetch('/admin/customer');
			if (response.ok) {
				const data = await response.json();
				if (data.success && data.customer) {
					customerData.set(data.customer);
				}
			}
		} catch (error) {
			console.error('Error fetching customer data:', error);
		}
	}

	// Check progress periodically
	function startProgressChecking() {
		// Clear any existing interval
		const interval = get(progressInterval);
		if (interval) {
			clearInterval(interval);
		}

		// Start a new interval
		const newInterval = setInterval(async () => {
			try {
				const response = await fetch('/admin/sync?progress=true');
				const result = await response.json();

				if (result.success) {
					if (result.inProgress) {
						syncProgress.set(result.progress);
					} else {
						// If sync is no longer in progress, stop checking
						const currentInterval = get(progressInterval);
						if (currentInterval) {
							clearInterval(currentInterval);
							progressInterval.set(null);
						}
					}
				}
			} catch (error) {
				console.error('Error checking progress:', error);
			}
		}, 1000) as unknown as number;

		progressInterval.set(newInterval);
	}

	async function handleImport() {
		try {
			isLoading.set(true);
			syncProgress.set(null);
			importMessage.set('Starting import...');

			// Start checking progress
			startProgressChecking();

			const response = await fetch('/admin/sync');
			const result = await response.json();

			// Stop progress checking
			const interval = get(progressInterval);
			if (interval) {
				clearInterval(interval);
				progressInterval.set(null);
			}

			if (result.success) {
				importMessage.set(result.message);
				// Refresh customer data after import
				fetchCustomerData();
			} else {
				importMessage.set(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Import error:', error);
			importMessage.set(
				`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
			);
		} finally {
			isLoading.set(false);
		}
	}

	async function handleDelete(
		table: 'vehicle' | 'vehicle_image' | 'vehicle_attribute' | 'customer'
	) {
		if (!confirm(`Are you sure you want to delete all data from ${table}?`)) {
			return;
		}

		try {
			isLoading.set(true);
			const response = await fetch('/admin/sync', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ table })
			});
			const result = await response.json();

			if (result.success) {
				importMessage.set(result.message);
				if (table === 'customer') {
					customerData.set(null);
				}
			} else {
				importMessage.set(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Delete error:', error);
			importMessage.set(
				`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
			);
		} finally {
			isLoading.set(false);
		}
	}

	// Add a function to handle auto-scrolling
	function scrollLogsToBottom() {
		if (get(autoScroll)) {
			setTimeout(() => {
				const pre = document.querySelector('.logs-container');
				if (pre) pre.scrollTop = pre.scrollHeight;
			}, 100);
		}
	}

	// Add a debug log when syncProgress updates
	$: if ($syncProgress && $syncProgress.logs) {
		console.log(`Logs updated: ${$syncProgress.logs.length} entries`);
		scrollLogsToBottom();
	}

	// Fetch customer data on mount
	onMount(() => {
		fetchCustomerData();
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Inventory Sync</h1>

	<!-- Customer Information Section -->
	{#if $customerData}
		<div class="mb-8 rounded-lg bg-background p-6 shadow-md dark:bg-background">
			<div class="mb-4 flex items-center gap-2">
				<Store class="h-6 w-6 text-blue-500" />
				<h2 class="text-xl font-semibold">Dealer Information</h2>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<h3 class="text-lg font-semibold">{$customerData.title || 'Dealer'}</h3>
					<p class="text-gray-600">{$customerData.description || ''}</p>
					<p class="mt-2">
						<span class="font-medium">Customer ID:</span>
						{$customerData.customerNumber || 'N/A'}
					</p>
					<p>
						<span class="font-medium">Last Modified:</span>
						{$customerData.modified || 'N/A'}
					</p>
				</div>

				<div>
					<div class="flex items-start gap-2">
						<User class="mt-1 h-5 w-5 text-gray-500" />
						<div>
							<p>{$customerData.address1 || ''}</p>
							{#if $customerData.address2}
								<p>{$customerData.address2}</p>
							{/if}
							<p>
								{$customerData.city || ''}, {$customerData.state || ''}
								{$customerData.zip || ''}
							</p>
							<p>{$customerData.country || ''}</p>
						</div>
					</div>

					<div class="mt-3">
						<p><span class="font-medium">Phone:</span> {$customerData.phone || 'N/A'}</p>
						<p><span class="font-medium">Email:</span> {$customerData.email || 'N/A'}</p>
						{#if $customerData.companyUrl}
							<p>
								<span class="font-medium">Website:</span>
								<a
									href={$customerData.companyUrl}
									target="_blank"
									class="text-blue-500 hover:underline"
								>
									{$customerData.companyUrl}
								</a>
							</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="mt-4 flex justify-end">
				<button
					class="flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
					onclick={() => handleDelete('customer')}
					disabled={$isLoading}
				>
					<AlertCircle class="h-4 w-4" /> Delete Customer Data
				</button>
			</div>
		</div>
	{/if}

	<div class="mb-8 rounded-lg bg-background p-6 shadow-md dark:bg-background">
		<h2 class="mb-4 text-xl font-semibold">Sync Inventory with Dealer Spike</h2>
		<p class="mb-4 text-gray-600">
			This will import all vehicles from the Dealer Spike XML feed. The process may take several
			minutes to complete.
		</p>

		<button
			class="my-10 flex flex-row items-center gap-1 rounded-lg bg-slate-800 px-4 py-5 text-white hover:bg-slate-700 disabled:opacity-50"
			onclick={handleImport}
			disabled={$isLoading}
		>
			{#if $isLoading}
				<Loader class="mr-2 h-6 w-6 animate-spin" /> Importing...
			{:else}
				<DatabaseZap class="mr-2 h-6 w-6" /> Sync Inventory
			{/if}
		</button>

		{#if $syncProgress}
			<div class="my-4 w-full max-w-md">
				<div class="mb-2 flex justify-between text-sm">
					<span>Progress: {getPercentComplete()}%</span>
					<span>Batch {$syncProgress.currentBatch} of {$syncProgress.totalBatches}</span>
				</div>
				<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
					<div
						class="h-full rounded-full bg-blue-500"
						style="width: {getPercentComplete()}%;"
					></div>
				</div>
				<div class="mt-4 grid grid-cols-2 gap-2">
					<div class="flex items-center gap-1">
						<CheckCircle2 class="h-4 w-4 text-green-500" />
						<span>Added: {$syncProgress.added}</span>
					</div>
					<div class="flex items-center gap-1">
						<CheckCircle2 class="h-4 w-4 text-blue-500" />
						<span>Updated: {$syncProgress.updated}</span>
					</div>
					<div class="flex items-center gap-1">
						<CheckCircle2 class="h-4 w-4 text-orange-500" />
						<span>Marked as Sold: {$syncProgress.markedAsSold}</span>
					</div>
					<div class="flex items-center gap-1">
						<CheckCircle2 class="h-4 w-4 text-purple-500" />
						<span>Images: {$syncProgress.imagesAdded}</span>
					</div>
				</div>
				<div class="mt-2 text-center text-sm text-gray-500">
					Estimated time remaining: {formatTime($syncProgress.estimatedTimeRemaining)}
				</div>

				<!-- Terminal toggle button -->
				<button
					class="mt-4 flex items-center justify-center rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
					onclick={toggleTerminal}
				>
					{$showTerminal ? 'Hide' : 'Show'} Terminal Output
				</button>

				<!-- Terminal output -->
				{#if $showTerminal && $syncProgress.logs && $syncProgress.logs.length > 0}
					<div
						class="mt-4 max-h-80 overflow-auto rounded-md bg-black p-4 font-mono text-xs text-green-400"
					>
						{#each $syncProgress.logs as log}
							<div class="whitespace-pre-wrap">{log}</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="mb-8 rounded-lg bg-background p-6 shadow-md dark:bg-background">
		<h2 class="mb-4 flex items-center gap-2 text-xl font-semibold">
			<Loader class="h-5 w-5 text-blue-500" />
			Sync Logs
		</h2>
		<p class="mb-4 text-gray-600">
			Real-time logs from the sync process. This shows the same information that appears in the
			terminal.
		</p>

		<div class="relative">
			<pre
				class="logs-container h-[300px] w-full overflow-y-auto rounded-md bg-slate-900 p-4 font-mono text-xs text-green-400">{#if $syncProgress && $syncProgress.logs && $syncProgress.logs.length > 0}
					{$syncProgress.logs.join('\n')}
				{:else}
					No logs available. Start a sync to see logs here.
				{/if}</pre>

			<!-- Auto-scroll controls -->
			<div class="mt-2 flex justify-between">
				<label class="flex items-center gap-2 text-xs">
					<input type="checkbox" bind:checked={$autoScroll} />
					<span>Auto-scroll to bottom</span>
				</label>
				<button
					class="rounded bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
					onclick={() => {
						console.log('Scrolling to bottom');
						const pre = document.querySelector('.logs-container');
						if (pre) {
							pre.scrollTop = pre.scrollHeight;
							console.log('Scrolled to', pre.scrollTop, 'of', pre.scrollHeight);
						}
					}}
				>
					Scroll to Bottom
				</button>
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-background p-6 shadow-md dark:bg-background">
		<h2 class="mb-4 text-xl font-semibold text-red-600">Danger Zone</h2>
		<p class="mb-4 text-gray-600">
			These actions will permanently delete data from the database. Use with caution.
		</p>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<button
				class="flex flex-row items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
				onclick={() => handleDelete('vehicle_attribute')}
				disabled={$isLoading}
			>
				<h2 class="text-lg font-bold">Step 1:</h2>
				<AlertCircle class="mr-2 h-6 w-6" /> Delete All Vehicle Attributes
			</button>

			<button
				class="flex flex-row items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
				onclick={() => handleDelete('vehicle_image')}
				disabled={$isLoading}
			>
				<h2 class="text-lg font-bold">Step 2:</h2>
				<AlertCircle class="mr-2 h-6 w-6" /> Delete All Vehicle Images
			</button>

			<button
				class="flex flex-row items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:opacity-50"
				onclick={() => handleDelete('vehicle')}
				disabled={$isLoading}
			>
				<h2 class="text-lg font-bold">Step 3:</h2>
				<AlertCircle class="mr-2 h-6 w-6" /> Delete All Vehicles
			</button>
		</div>

		{#if $importMessage}
			<p class={`mt-4 ${$importMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
				{$importMessage}
			</p>
		{/if}
	</div>
</div>
