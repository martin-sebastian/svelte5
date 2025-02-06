<script lang="ts">
	const { children } = $props();
	import '../app.css';
</script>

<div class="min-h-screen bg-background">
	{@render children()}
</div>
