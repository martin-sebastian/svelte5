<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { keyTagStore } from '$lib/stores/keyTagStore';
	import { Card } from '$lib/components/ui/card';

	let selectedTemplate = $state(keyTagStore.templates[0].id);
	let currentTemplate = $derived(keyTagStore.templates.find((t) => t.id === selectedTemplate));

	// Using state mutation instead of store updates
	function updateTemplate(value: string) {
		selectedTemplate = value;
		keyTagStore.selectedTemplateId = value;
	}
</script>

<Card class="p-4">
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Key Tag Template</h3>

		<Select.Root value={selectedTemplate} onValueChange={(value) => (selectedTemplate = value)}>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Select a template" />
			</Select.Trigger>
			<Select.Content>
				{#each keyTagStore.templates as template}
					<Select.Item value={template.id}>
						<div class="flex flex-col">
							<span>{template.name}</span>
							<span class="text-xs text-gray-500">{template.description}</span>
						</div>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		{#if currentTemplate}
			<div class="text-sm text-gray-500">
				<p>Size: {currentTemplate.width} × {currentTemplate.height}</p>
				<p>Orientation: {currentTemplate.orientation}</p>
			</div>
		{/if}
	</div>
</Card>
