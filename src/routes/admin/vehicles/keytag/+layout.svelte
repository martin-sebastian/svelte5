<script lang="ts">
	const { children } = $props();
</script>

<div class="bg-white">
	{@render children()}
</div>

<style>
	:global(body) {
		background: white;
	}
</style>
