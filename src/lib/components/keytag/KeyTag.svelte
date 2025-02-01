<script lang="ts">
	import { keyTagStore } from '$lib/stores/keyTagStore';

	const selectedTemplate = $derived(
		$keyTagStore?.templates?.find((t) => t?.id === $keyTagStore?.selectedTemplateId) ?? null
	);

	const { children } = $props();
</script>

<div
	class="key-tag"
	style:width={selectedTemplate?.width}
	style:height={selectedTemplate?.height}
	style:background-image={selectedTemplate?.backgroundImage
		? `url('${selectedTemplate.backgroundImage}')`
		: 'none'}
	style:background-color={selectedTemplate?.backgroundColor}
	style:background-size="contain"
	style:background-repeat="no-repeat"
	style:background-position="center"
>
	<div
		class="printable-area"
		style:width={selectedTemplate?.printableArea?.width}
		style:height={selectedTemplate?.printableArea?.height}
		style:margin-top={selectedTemplate?.printableArea?.marginTop}
		style:margin-left={selectedTemplate?.printableArea?.marginLeft}
	>
		{@render children()}
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
