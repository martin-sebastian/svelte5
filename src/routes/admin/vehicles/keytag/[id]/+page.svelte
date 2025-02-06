<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { keyTagStore } from '$lib/stores/keyTagStore';
	import KeyTag from '$lib/components/keytag/KeyTag.svelte';
	import TemplateSelector from '$lib/components/keytag/TemplateSelector.svelte';
	import VersaTagStandard from '$lib/components/keytag/templates/VersaTagStandard.svelte';
	import VersaTagWhite from '$lib/components/keytag/templates/VersaTagWhite.svelte';
	import VersaTagGray from '$lib/components/keytag/templates/VersaTagGray.svelte';
	import StandardLabel from '$lib/components/keytag/templates/StandardLabel.svelte';
	import { Printer, X, ZoomIn, ZoomOut } from 'lucide-svelte';

	const { data } = $props<{ data: PageData }>();
	const { vehicle } = $derived(data);

	let scale = $state(2);

	const selectedTemplate = $derived($keyTagStore?.selectedTemplateId);

	const zoomIn = () => (scale = Math.min(scale + 0.1, 3));
	const zoomOut = () => (scale = Math.max(scale - 0.1, 0.5));
	const handlePrint = () => window.print();
	const handleClose = () => goto('/admin/vehicles');
</script>

{#if vehicle}
	<!-- Template selector in top right -->
	<div class="fixed right-8 top-20 z-10 w-64 print:hidden">
		<TemplateSelector />
	</div>

	<div class="dots flex h-screen w-full items-center justify-center overflow-hidden">
		<div style:transform="scale({scale})" style:transform-origin="center">
			<KeyTag>
				{#if selectedTemplate === 'versa-tag-standard-yellow'}
					<VersaTagStandard {vehicle} />
				{:else if selectedTemplate === 'versa-tag-white'}
					<VersaTagWhite {vehicle} />
				{:else if selectedTemplate === 'versa-tag-gray'}
					<VersaTagGray {vehicle} />
				{:else if selectedTemplate === 'standard-label'}
					<StandardLabel {vehicle} />
				{/if}
			</KeyTag>
		</div>
	</div>

	<!-- Bottom controls -->
	<div class="fixed bottom-4 right-4 flex gap-2 print:hidden">
		<button
			onclick={handleClose}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Close and return to vehicles"
		>
			<X class="h-6 w-6" />
		</button>
		<button
			onclick={handlePrint}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Print keytag"
		>
			<Printer class="h-6 w-6" />
		</button>
		<button
			onclick={zoomOut}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom out"
		>
			<ZoomOut class="h-6 w-6" />
		</button>
		<button
			onclick={zoomIn}
			class="rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			aria-label="Zoom in"
		>
			<ZoomIn class="h-6 w-6" />
		</button>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-semibold">Vehicle not found</h2>
			<p class="mt-2 text-gray-600">The requested vehicle could not be loaded.</p>
			<button
				onclick={handleClose}
				class="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				Return to Vehicles
			</button>
		</div>
	</div>
{/if}

<style>
	.dots {
		background-image: radial-gradient(
			circle at center,
			rgba(120, 120, 120, 0.2) 1px,
			transparent 1px
		);
		background-size: 10px 10px;
	}
</style>
