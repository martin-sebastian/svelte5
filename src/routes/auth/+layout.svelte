<script lang="ts">
	import { ShieldPlus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	let { children } = $props();
</script>

<div class="container relative flex min-h-screen flex-col items-center justify-center">
	<a href="/" class="absolute left-8 top-8 flex items-center gap-2" aria-label="Home">
		<ShieldPlus class="h-8 w-8" />
		<div class="hidden sm:flex">
			<span class="font-bold">DEALER</span><span class="font-black">OPS</span>
		</div>
	</a>
	<Button href="/" variant="outline" class="absolute right-8 top-8">Back to Home</Button>

	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
		{@render children()}
	</div>
</div>
