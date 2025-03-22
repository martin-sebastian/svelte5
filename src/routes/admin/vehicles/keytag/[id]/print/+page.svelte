<script lang="ts">
	import type { PageData } from './$types';
	import { setVehicleData } from '$lib/stores/keyTagState.svelte';
	import { templates } from '$lib/components/keytag';
	import PrintInstructions from '$lib/components/keytag/PrintInstructions.svelte';
	import type { TemplateId } from '$lib/components/keytag/types';
	import { onMount } from 'svelte';

	// Using $props instead of export let
	const { data } = $props<{ data: PageData }>();

	// Using runes for reactivity
	const vehicle = $derived(data?.vehicle);
	const templateId = $derived(data.templateId || 'standard');
	const currentTemplate = $derived(templates[templateId as keyof typeof templates]);

	// Set vehicle data whenever it changes
	$effect(() => {
		if (vehicle) {
			setVehicleData(vehicle as any);
		}
	});

	// Automatically print when component is mounted
	onMount(() => {
		// Small delay to ensure template is fully rendered
		const printTimer = setTimeout(() => {
			// Only trigger auto-print in production to avoid issues during development
			if (window.location.hostname !== 'localhost') {
				window.print();
			}
		}, 500);

		return () => clearTimeout(printTimer);
	});
</script>

<svelte:head>
	<title>Print Key Tag - {vehicle?.stockNumber || 'Vehicle'}</title>
</svelte:head>

<div class="print-container">
	<!-- Print instructions (only visible on screen) -->
	<div class="screen-only mb-4">
		<div class="mx-auto max-w-3xl p-4">
			<div class="mb-4 flex justify-between">
				<button
					onclick={() => window.close()}
					class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
				>
					Close
				</button>
				<button
					onclick={() => window.print()}
					class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
				>
					Print
				</button>
			</div>
			<PrintInstructions />
		</div>
	</div>

	<!-- The actual printable content -->
	<div class="print-content">
		{#if vehicle && currentTemplate}
			<svelte:component this={currentTemplate} />
		{:else}
			<div class="flex h-full items-center justify-center">
				<p>Loading template...</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.print-container {
		width: 100%;
		height: 100%;
	}

	.print-content {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		min-height: 300px;
	}

	/* Print-specific styles */
	@media print {
		.screen-only {
			display: none;
		}

		.print-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		:global(body) {
			margin: 0;
			padding: 0;
		}
	}
</style>
