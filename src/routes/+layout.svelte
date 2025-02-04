<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';

	const { data, children } = $props();

	// Optional: Vercel Analytics
</script>

<!-- Main layout structure -->
<div class="min-h-screen w-full bg-background font-sans text-foreground antialiased">
	<main class="flex-1">
		{@render children()}
	</main>
</div>

<!-- Add toast notifications -->
<Toaster />
