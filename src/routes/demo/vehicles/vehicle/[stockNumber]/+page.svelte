<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	// Function to format description: strip HTML and format as single paragraph
	function formatDescription(html: string) {
		// First strip HTML
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		const text = tmp.textContent || tmp.innerText || '';

		// Replace line breaks and multiple spaces with comma + space
		return text
			.replace(/(\r\n|\n|\r)/gm, ', ') // Replace line breaks with comma
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.replace(/,\s*,/g, ',') // Replace multiple commas with single comma
			.replace(/\s*,\s*/g, ', ') // Ensure proper spacing around commas
			.trim();
	}

	const { vehicle } = data;
</script>

{#if vehicle}
	<div class="container flex h-screen w-full flex-col items-center justify-center">
		<h1 class="mb-1 w-full text-start text-4xl font-bold">{vehicle.title}</h1>
		<div class="mb-1 w-full text-start text-[12px]">
			{formatDescription(vehicle.description || '')}
		</div>
		<div class="my-5 overflow-hidden rounded-lg border border-gray-500/25">
			<div class="overflow-hidden text-center text-xs">
				{#if vehicle.primaryImage}
					<div class="w-full">
						<a href={vehicle.link} target="_blank">
							<img
								src={vehicle.primaryImage}
								alt="Vehicle"
								class="h-[300px] w-auto object-contain"
							/>
						</a>
					</div>
				{:else}
					<div class="flex h-[300px] w-full items-center justify-center bg-gray-100">
						<span class="text-gray-400">No Image Available</span>
					</div>
				{/if}
				<div class="my-1 text-[10px]">
					{vehicle.usage}
					{vehicle.metricValue}
					{vehicle.metricType}
				</div>
				<div class="mb-1 text-[14px] font-bold">{vehicle.title}</div>

				<div class="mb-1 text-[10px]">
					{vehicle.year}
					{vehicle.manufacturer}
					{vehicle.model}
				</div>
				<div class="mb-1 text-[10px]">
					{vehicle.modelType}
				</div>
				<div class="mb-1 text-[10px]">
					{vehicle.vin}
				</div>

				{#if vehicle.attributes?.length}
					<div class="grid grid-cols-1 gap-0.5">
						{#each vehicle.attributes as attr}
							<div class="text-[8px]">
								<span class="font-semibold">{attr.name}:</span>
								{attr.value}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="loading">Loading...</div>
{/if}
