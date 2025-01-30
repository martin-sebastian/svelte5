<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { DatabaseZap } from 'lucide-svelte';
	import { CircleGauge } from 'lucide-svelte';
	import { ImageOff } from 'lucide-svelte';
	import { Tags } from 'lucide-svelte';
	import { Tag } from 'lucide-svelte';
	import { Share } from 'lucide-svelte';
	import { Share2 } from 'lucide-svelte';
	import { Settings } from 'lucide-svelte';
	import { KeySquare } from 'lucide-svelte';
	import { LayoutGrid } from 'lucide-svelte';
	import { List } from 'lucide-svelte';
	import { AlignLeft } from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	const { data } = $page;

	let message = 'Dealership Power Tools';
	let description = 'For Dealer Spike';
	let subMessage =
		'Dealer Ops connects to your Dealer Spike inventory and lets you print vehicle keytags, hangtags, and easily post individual vehicles to your social media.';

	// Create a tweened store for the animation
	const position = tweened(0, {
		duration: 30000,
		easing: (t) => t
	});

	// Set up infinite animation
	function animate() {
		position.set(100).then(() => {
			position.set(0, { duration: 0 });
			animate();
		});
	}

	// Start animation on mount
	$: {
		animate();
	}
</script>

<main class="align-start flex h-full min-h-screen w-full flex-col items-center overflow-hidden">
	<div class="flex max-w-6xl flex-col items-center px-2 pt-2 text-center sm:px-1 sm:pt-40">
		<h1
			class="mx-2 my-4 bg-gradient-to-r from-pink-500 via-gray-600 to-blue-800 bg-clip-text text-6xl font-extrabold text-transparent sm:mx-5 sm:text-6xl md:text-8xl lg:text-9xl"
		>
			{message}
			<span
				class="mx-2 block bg-clip-text text-2xl font-extrabold text-slate-500 text-transparent sm:mx-4 sm:inline sm:text-5xl md:text-6xl lg:text-7xl"
			>
				{description}
			</span>
		</h1>

		<div
			class="mx-2 flex max-w-4xl justify-center py-2 text-center text-sm text-gray-500/75 sm:mx-4 sm:py-5 sm:text-lg md:text-xl"
		>
			{subMessage}
		</div>

		<!-- Buttons section -->
		<div class="mb-3 flex w-full flex-col items-center justify-start px-2 sm:mb-5">
			<div class="mb-4 flex w-full items-center gap-2 sm:mb-8 sm:gap-4">
				{#if data.session}
					<Button
						href="/admin"
						class="flex-[3] rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 sm:text-lg"
					>
						Go to Dashboard
					</Button>
					<form action="/auth?/signout" method="POST" class="flex-[2]">
						<Button
							type="submit"
							class="w-full rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600 sm:text-lg"
						>
							Sign Out
						</Button>
					</form>
				{:else}
					<div class="flex w-full items-center gap-2 sm:gap-4">
						<a
							href="/auth/register"
							class="flex-[3] rounded-md border border-gray-400/50 bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600/75 hover:shadow-lg sm:text-lg"
						>
							Sign Up Now!
						</a>
						<a
							href="/auth"
							class="flex-[2] rounded-md border border-gray-600/50 bg-gray-500/50 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600/75 hover:shadow-lg sm:text-lg"
						>
							Login
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sliding icons section -->
		<div class="relative mb-3 w-full max-w-4xl overflow-hidden px-2 sm:mb-5 sm:px-4">
			<div
				class="animate-slide flex flex-row items-center gap-1 sm:gap-4"
				style:transform="translateX(-{$position}%)"
			>
				<!-- First set -->
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<KeySquare class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Keytags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<Tags class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Hangtags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<Share2 class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Social Media Sharing</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<DatabaseZap class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Database Sync</span
					>
				</div>
				<!-- Repeat first set for seamless loop -->
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<KeySquare class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Keytags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<Tags class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Hangtags</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<Share2 class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Social Media Sharing</span
					>
				</div>
				<div class="flex flex-shrink-0 flex-row items-center gap-1 sm:gap-2">
					<DatabaseZap class="h-3 w-3 sm:h-5 sm:w-5" />
					<span
						class="text-nowrap text-[10px] font-normal capitalize text-gray-200/50 sm:text-xs md:text-sm"
						>Database Sync</span
					>
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
	</div>
</main>

<style>
	.animate-slide:hover {
		animation-play-state: paused;
	}
</style>
