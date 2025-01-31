<script lang="ts">
	import { KeyTag } from '$lib/components/keytag/KeyTag.svelte';
	import { TemplateSelector } from '$lib/components/keytag/TemplateSelector.svelte';

	let scale = $state(2); // For better visibility during preview
</script>

<div class="flex min-h-screen flex-col gap-4 p-4">
	<div class="w-64">
		<TemplateSelector />
	</div>

	<div class="flex items-center justify-center">
		<div style:transform="scale({scale})">
			<KeyTag>
				<!-- Content will go here later -->
			</KeyTag>
		</div>
	</div>
</div>
