<script lang="ts">
	import { onMount } from 'svelte';

	let result: string | null = null;
	let isLoading = false;
	let error: string | null = null;

	async function generateDescription() {
		isLoading = true;
		error = null;
		result = null;

		try {
			const response = await fetch('/api/openai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					prompt:
						"Write a 1 paragraph SEO friendly and exciting description for 2023 Scarab Jet Boat 215 ID 460HP WAKE EDITION model code SBI215-A23, trim color charcoal.  Don't use the model code in the description, only use it to get the most accurate boat, engine or feature specs.  Use the trim color briefly when describing this boat."
				})
			});

			const data = await response.json();

			if (data.error) {
				error = data.error;
			} else {
				result = data.result;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
			console.error('API error:', e);
		} finally {
			isLoading = false;
		}
	}

	// Generate on mount
	onMount(() => {
		generateDescription();
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">AI Description Generator</h1>

	{#if isLoading}
		<p class="text-gray-600">Generating description...</p>
	{:else if error}
		<div class="mb-4 rounded bg-red-100 p-4 text-red-700">
			<p>Error: {error}</p>
			<button
				class="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
				on:click={generateDescription}
			>
				Try Again
			</button>
		</div>
	{:else if result}
		<div class="mb-4 rounded bg-white p-6 shadow">
			<h2 class="mb-2 text-lg font-semibold">Generated Description:</h2>
			<p class="text-gray-800">{result}</p>
		</div>
		<button
			class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
			on:click={generateDescription}
		>
			Regenerate
		</button>
	{/if}
</div>
