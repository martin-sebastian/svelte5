<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { DatabaseZap, Tags, Share2, KeySquare } from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	const { data } = $page;

	let message = 'Dealership Power Tools';
	let description = 'For Dealer Spike';
	let subMessage =
		'Dealer Ops connects to your Dealer Spike inventory and lets you print vehicle keytags, hangtags, and easily post individual vehicles to your social media.';

	// Create a tweened store for the animation with shorter duration and linear easing
	const position = tweened(0, {
		duration: 15000,
		easing: (t) => t
	});

	// Set up infinite animation with a reset that happens before the end
	function animate() {
		position.set(50).then(() => {
			position.set(0, { duration: 0 });
			animate();
		});
	}

	// Start animation on mount
	$: {
		animate();
	}
</script>

<main class="flex min-h-screen w-full flex-col items-center justify-start">
	<div class="container flex flex-col items-center px-6 pt-24 text-center sm:px-8 sm:pt-40">
		<!-- Title Section -->
		<div class="flex flex-col items-center gap-6">
			<h1 class="bg-gradient-to-r from-pink-500 via-blue-800 to-gray-700 bg-clip-text text-center">
				<span class="max-w-2xl text-6xl font-black text-transparent sm:text-7xl md:text-8xl">
					{message}
				</span>
				<span class="ml-2 text-5xl font-black text-gray-500/75 sm:text-6xl md:text-7xl">
					{description}
				</span>
			</h1>

			<p class="max-w-2xl text-center text-2xl text-gray-500/75 sm:text-lg md:text-2xl">
				{subMessage}
			</p>

			<!-- Buttons section -->
			<div class="mt-4 flex w-full max-w-[400px] items-center justify-center gap-4">
				<Button
					href="/auth/register"
					class="flex-1 rounded-md border border-gray-400/50 bg-blue-600 px-4 py-2 text-base font-semibold text-white transition-all hover:bg-blue-600/75 hover:shadow-lg"
				>
					Sign Up Now!
				</Button>
			</div>
		</div>
	</div>

	<!-- Sliding icons section -->
	<div class="relative my-10 w-full max-w-4xl overflow-hidden px-2 py-10">
		<div class="flex flex-row items-center">
			<div
				class="animate-slide flex flex-row items-center gap-4"
				style:transform="translateX(-{$position}%)"
				style:transition="transform {15}s linear"
			>
				<!-- First set -->
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<KeySquare class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Keytags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<Tags class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Hangtags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<Share2 class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Social Media</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<DatabaseZap class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Database Sync</span
					>
				</div>
				<!-- Duplicate set for seamless loop -->
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<KeySquare class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Keytags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<Tags class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Hangtags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<Share2 class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Social Media</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-2">
					<DatabaseZap class="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
					<span class="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-base"
						>Database Sync</span
					>
				</div>
			</div>
		</div>
	</div>

	<!-- Carousel section -->
	<div class="w-full max-w-5xl px-2 sm:px-4">
		<Carousel.Root orientation="horizontal" class="w-full">
			<Carousel.Content>
				<Carousel.Item class="w-full">
					<img src="/images/dashboard.png" alt="Dashboard" class="h-auto w-full" />
				</Carousel.Item>
				<Carousel.Item>
					<img src="/images/keytag.png" alt="Keytag" class="w-full" />
				</Carousel.Item>
				<Carousel.Item>
					<img src="/images/hangtag.png" alt="Hangtag" class="w-full" />
				</Carousel.Item>
				<Carousel.Item>
					<img src="/images/list-view.png" alt="List View" class="w-full" />
				</Carousel.Item>
				<Carousel.Item>
					<img src="/images/zoomed.png" alt="Zoomed In" class="w-full" />
				</Carousel.Item>
			</Carousel.Content>
			<Carousel.Previous class="hidden sm:block" />
			<Carousel.Next class="hidden sm:block" />
		</Carousel.Root>
	</div>
</main>

<style>
	.animate-slide:hover {
		animation-play-state: paused;
	}
</style>
