<script lang="ts">
	import { keyTagStore } from '$lib/stores/keyTagStore';
	import { Card } from '$lib/components/ui/card';

	const currentTemplate = $derived(
		$keyTagStore?.templates?.find((t) => t?.id === $keyTagStore?.selectedTemplateId)
	);

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		$keyTagStore.selectedTemplateId = target.value;
	}
</script>

<Card class="p-4">
	<div class="space-y-4">
		<h3 class="text-lg font-medium">Key Tag Template</h3>

		<select
			class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			value={$keyTagStore.selectedTemplateId}
			onchange={handleChange}
		>
			{#each $keyTagStore.templates as template}
				<option value={template.id}>
					{template.name}
				</option>
			{/each}
		</select>

		{#if currentTemplate}
			<div class="text-sm text-gray-500">
				<p>Size: {currentTemplate.width} × {currentTemplate.height}</p>
				<p>Orientation: {currentTemplate.orientation}</p>
				<p class="text-xs">{currentTemplate.description}</p>
			</div>
		{/if}
	</div>
</Card>
