<script lang="ts">
	import { selectedTemplateId, setTemplate } from '$lib/stores/keyTagState.svelte';
	import { Card } from '$lib/components/ui/card';
	import { templates } from './index';
	import type { TemplateId } from './types';

	// Define template metadata directly
	const templateMetadata = {
		standard: {
			name: 'Standard Label',
			width: '1.25in',
			height: '3in',
			orientation: 'Portrait',
			description: 'Standard key tag label with basic vehicle information'
		},
		gray: {
			name: 'Versa Tag Gray',
			width: '1.22in',
			height: '3in',
			orientation: 'Portrait',
			description: 'Gray Versa Tag for a professional look'
		},
		standard_white: {
			name: 'Versa Tag Standard',
			width: '1.22in',
			height: '3in',
			orientation: 'Portrait',
			description: 'Standard Versa Tag with white background'
		},
		standard_yellow: {
			name: 'Versa Tag Yellow',
			width: '1.22in',
			height: '3in',
			orientation: 'Portrait',
			description: 'Yellow Versa Tag for high visibility'
		},
		white: {
			name: 'Versa Tag White',
			width: '1.22in',
			height: '3in',
			orientation: 'Portrait',
			description: 'White Versa Tag with clean design'
		},
		white_custom: {
			name: 'Versa Tag White Custom',
			width: '1.22in',
			height: '3in',
			orientation: 'Portrait',
			description: 'Customized white Versa Tag with additional fields'
		}
	};

	// Get the current template metadata based on the selected template ID
	$: currentTemplateMetadata = $selectedTemplateId
		? templateMetadata[$selectedTemplateId as keyof typeof templateMetadata]
		: null;

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		setTemplate(target.value as TemplateId);
	}
</script>

<Card class="p-4">
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Key Tag Template</h3>

		<select
			class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			value={$selectedTemplateId}
			onchange={handleChange}
		>
			{#each Object.entries(templates) as [id, template]}
				<option value={id}>
					{templateMetadata[id as keyof typeof templateMetadata]?.name || id}
				</option>
			{/each}
		</select>

		{#if currentTemplateMetadata}
			<div class="text-sm text-gray-500">
				<p>
					Size: {currentTemplateMetadata.width || 'Standard'} × {currentTemplateMetadata.height ||
						'Standard'}
				</p>
				<p>Orientation: {currentTemplateMetadata.orientation || 'Portrait'}</p>
				<p class="text-xs">{currentTemplateMetadata.description || 'No description available'}</p>
			</div>
		{/if}
	</div>
</Card>
