<script lang="ts">
	import { selectedTemplateId, setTemplate } from '$lib/stores/keyTagState.svelte';
	import { templates } from './index';
	import { templateMetadata } from './templateMeta';
	import type { TemplateId } from './types';

	// Get all available templates with their metadata
	const availableTemplates = Object.entries(templateMetadata).map(([id, meta]) => ({
		id: id as TemplateId,
		...meta
	}));

	// Handle template selection
	function selectTemplate(id: TemplateId) {
		setTemplate(id);
	}
</script>

<div class="template-selector flex flex-row items-center justify-center">
	<div class="grid grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-5">
		{#each availableTemplates as template}
			<button
				class="template-option spece-between my-10 flex flex-col items-center rounded-lg border p-2 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 {$selectedTemplateId ===
				template.id
					? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
					: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}"
				onclick={() => selectTemplate(template.id)}
				aria-label="Select {template.name}"
			>
				<div class="template-preview m-2 h-24 w-full overflow-hidden rounded border bg-gray-400">
					<!-- Template preview -->
					<div class="origin-top-left scale-[0.35] text-center">
						<svelte:component this={templates[template.id]} />
					</div>
				</div>
				<div class="text-center">
					<div class="text-sm font-medium">{template.name}</div>
					<div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{template.width} × {template.height}
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.template-preview {
		position: relative;
		text-align: center;
		margin: 5px auto;
		padding: 5px;
		width: 120px;
		height: 120px;
	}
</style>
