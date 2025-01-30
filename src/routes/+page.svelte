<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import {
		DatabaseZap,
		CircleGauge,
		ImageOff,
		Tags,
		Tag,
		Share,
		Share2,
		Settings,
		KeySquare,
		LayoutGrid,
		List,
		AlignLeft
	} from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
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
	<div class="flex max-w-[1400px] flex-col items-center px-6 pt-24 text-center sm:px-8 sm:pt-40">
		<!-- Title Section -->
		<div class="flex flex-col items-center gap-6">
			<h1 class="text-center">
				<span
					class="bg-gradient-to-r from-pink-500 via-gray-600 to-blue-800 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl md:text-8xl"
				>
					{message}
				</span>
				<span class="mt-4 block text-3xl font-bold text-slate-500 sm:text-4xl md:text-5xl">
					{description}
				</span>
			</h1>

			<p class="max-w-[600px] text-center text-base text-gray-500/75 sm:text-lg">
				{subMessage}
			</p>

			<!-- Buttons section -->
			<div class="mt-4 flex w-full max-w-[400px] items-center justify-center gap-4">
				{#if data.session}
					<Button
						href="/admin"
						class="flex-1 rounded-md bg-blue-500 px-4 py-2 text-base font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg"
					>
						Go to Dashboard
					</Button>
					<form action="/auth?/signout" method="POST" class="flex-1">
						<Button
							type="submit"
							class="w-full rounded-md bg-gray-500 px-4 py-2 text-base font-semibold text-white transition-all hover:bg-gray-600 hover:shadow-lg"
						>
							Sign Out
						</Button>
					</form>
				{:else}
					<Button
						href="/auth/register"
						class="flex-1 rounded-md border border-gray-400/50 bg-blue-600 px-4 py-2 text-base font-semibold text-white transition-all hover:bg-blue-600/75 hover:shadow-lg"
					>
						Sign Up Now!
					</Button>
					<Button
						href="/auth"
						class="flex-1 rounded-md border border-gray-600/50 bg-gray-500/50 px-4 py-2 text-base font-semibold text-white transition-all hover:bg-gray-600/75 hover:shadow-lg"
					>
						Login
					</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Sliding icons section -->
	<div class="relative my-8 w-full max-w-4xl overflow-hidden px-2 sm:my-8 sm:px-4">
		<div class="flex flex-row items-center">
			<div
				class="flex flex-row items-center gap-4"
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
			<div class="hidden sm:block">
				<Carousel.Previous />
				<Carousel.Next />
			</div>
		</Carousel.Root>
	</div>
</main>

<style>
	.animate-slide:hover {
		animation-play-state: paused;
	}
</style>
