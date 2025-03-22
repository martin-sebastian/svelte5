<script lang="ts">
	import type { PageData } from './$types';
	import type { Motorcycle } from '$lib/server/db/schema';

	// Using the correct way to access page data in Svelte 5
	const { data } = $props<{ data: PageData }>();
	$effect(() => {
		console.log('Page data:', data);
		console.log('Motorcycles:', data?.motorcycles);
	});
</script>

<h1 class="mt-5 pt-5 text-2xl font-bold">Motorcycles Preview</h1>

{#if data?.motorcycles && data.motorcycles.length > 0}
	<table>
		<thead>
			<tr>
				<th>Title</th>
				<th>Price</th>
				<th>Stock Number</th>
				<th>Vin</th>
				<th>Color</th>
			</tr>
		</thead>
		<tbody>
			{#each data.motorcycles as motorcycle}
				<tr>
					<td>{motorcycle.title}</td>
					<td>{motorcycle.price}</td>
					<td>{motorcycle.stock_number}</td>
					<td>{motorcycle.vin}</td>
					<td>{motorcycle.color}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No motorcycles found.</p>
{/if}

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 4px;
		text-align: left;
	}
	th {
		border-bottom: 1px solid #ddd;
	}
</style>
