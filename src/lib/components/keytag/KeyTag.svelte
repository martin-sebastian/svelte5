<script lang="ts">
	import { keyTagStore } from '$lib/stores/keyTagStore';

	let selectedTemplate = $state(keyTagStore.templates[0].id);
	let template = $derived(keyTagStore.templates.find((t) => t.id === selectedTemplate));
</script>

<div
	class="key-tag relative"
	style:width={template?.width}
	style:height={template?.height}
	style:background-image="url('{template?.backgroundImage}')"
	style:background-size="contain"
	style:background-repeat="no-repeat"
	style:background-position="center"
>
	<div
		class="printable-area absolute"
		style:width={template?.printableArea.width}
		style:height={template?.printableArea.height}
		style:margin-top={template?.printableArea.marginTop}
		style:margin-left={template?.printableArea.marginLeft}
	>
		<!-- Template content goes here -->
		<slot />
	</div>
</div>

<style>
	.key-tag {
		position: relative;
		overflow: hidden;
	}

	.printable-area {
		position: absolute;
		z-index: 1;
	}

	@media print {
		.key-tag {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
