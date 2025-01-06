<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const { vehicle } = data;
</script>

{#if vehicle}
	<div class="flex h-screen w-full items-center justify-center zoom-out-50">
		<div class="m-5 h-[6in] w-[8.5in] border border-gray-500 p-10">
			<div class="overflow-hidden text-center text-xs">
				{#if vehicle.primaryImage}
					<div class="w-full">
						<img
							src={vehicle.primaryImage}
							alt="Vehicle"
							class="max-h-[200px] w-auto object-contain"
						/>
					</div>
				{:else}
					<div class="flex h-[200px] w-full items-center justify-center bg-gray-100">
						<span class="text-gray-400">No Image Available</span>
					</div>
				{/if}
				<div class="my-1 text-[10px]">
					{vehicle.usage}
				</div>
				<div class="mb-1 text-[14px] font-bold">#{vehicle.stockNumber}</div>
				<div class="mb-1 text-[14px] font-bold">
					{vehicle.year}
				</div>
				<div class="mb-1 text-[12px] font-bold">
					{vehicle.manufacturer}
				</div>
				<div class="mb-1 text-[10px]">
					{vehicle.modelName}
				</div>
				<div class="mb-1 text-[10px]">
					{vehicle.color}
				</div>
				<div class="mb-1 text-[10px]">
					{vehicle.metricValue}
					{vehicle.metricType}
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
