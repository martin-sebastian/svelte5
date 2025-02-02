<script lang="ts">
	let { children } = $props();
</script>

<div class="h-screen w-full overflow-hidden">
	{@render children()}
</div>
