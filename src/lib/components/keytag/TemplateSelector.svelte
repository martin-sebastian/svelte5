<script lang="ts">
	import { selectedTemplateId, setTemplate } from '$lib/stores/keyTagState.svelte';
	import { Card } from '$lib/components/ui/card';
	import { templates } from './index';
	import type { TemplateId } from './types';

	// Define a type for template metadata
	type TemplateComponent = {
		name?: string;
		width?: string;
		height?: string;
		orientation?: string;
		description?: string;
	};

	// Get the current template based on the selected template ID
	$: currentTemplate = $selectedTemplateId
		? (templates[$selectedTemplateId as keyof typeof templates] as unknown as TemplateComponent)
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
					{(template as unknown as TemplateComponent).name || id}
				</option>
			{/each}
		</select>

		{#if currentTemplate}
			<div class="text-sm text-gray-500">
				<p>Size: {currentTemplate.width || 'Standard'} × {currentTemplate.height || 'Standard'}</p>
				<p>Orientation: {currentTemplate.orientation || 'Portrait'}</p>
				<p class="text-xs">{currentTemplate.description || 'No description available'}</p>
			</div>
		{/if}
	</div>
</Card>
