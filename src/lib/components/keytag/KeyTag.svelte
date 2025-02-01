<script lang="ts">
	import { keyTagStore } from '$lib/stores/keyTagStore';

	let selectedTemplate = $state(keyTagStore.templates[0].id);
	let template = $derived(keyTagStore.templates.find((t) => t.id === selectedTemplate));
</script>

<div
	class="key-tag"
	style:width={template?.width}
	style:height={template?.height}
	style:background-image="url('{template?.backgroundImage}')"
	style:background-size="contain"
	style:background-repeat="no-repeat"
	style:background-position="center"
>
	<div class="printable-area" style:width={template?.width} style:height={template?.height}>
		<!-- Template content goes here -->
		<slot />
	</div>
</div>

<style>
	.key-tag {
		position: relative;
		overflow: hidden;
		padding: 0;
		margin: 0;
	}

	.printable-area {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0;
		margin: 0;
		z-index: 1;
	}

	@media print {
		.key-tag {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
