<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const { vehicle } = data;
</script>

{#if vehicle}
	<div class="flex h-screen w-full items-center justify-center">
		<div
			class="label-card h-[2in] w-[1.5in] overflow-hidden rounded-lg border border-gray-500/25 bg-white text-black"
		>
			<div class="overflow-hidden text-center text-xs">
				<div class="mt-1 text-[10pt]">
					{vehicle.usage}
				</div>
				<div
					class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[14pt] font-bold"
				>
					#{vehicle.stockNumber}
				</div>
				<div class="mb-1 text-[14pt] font-bold">
					{vehicle.year}
				</div>
				<div class="mb-1 text-[12pt] font-bold">
					{vehicle.manufacturer}
				</div>
				<div
					class="mb-1 line-clamp-2 flex min-h-[2em] items-center justify-center text-[10pt] font-bold"
				>
					{vehicle.modelName}
				</div>
				<div class="mb-1 overflow-hidden text-[10pt]">
					{vehicle.color}
				</div>
				<div class="mb-0 text-[10pt]">
					{vehicle.metricValue}
					{vehicle.metricType}
				</div>

				<div class="mb-1 text-[9pt]">
					{vehicle.vin}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="loading">Loading...</div>
{/if}

<style>
	@media print {
		.label-card {
			width: 1.5in !important;
			height: 2in !important;
			margin: 0 !important;
			padding: 0.125in !important;
			page-break-after: always;
		}
	}
</style>
