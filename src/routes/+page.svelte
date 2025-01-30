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
	const { data } = $page;

	let message = 'Dealership Power Tools';
	let description = 'For Dealer Spike';
	let subMessage =
		'Dealer Ops connects to your Dealer Spike inventory and lets you print vehicle keytags, hangtags, and easily post individual vehicles to your social media.';
</script>

<main class="align-start flex h-full min-h-screen w-full flex-col items-center overflow-hidden">
	<div class="mt-20 flex max-w-6xl flex-col items-center text-center">
		<h1
			class="mx-5 bg-gradient-to-r from-gray-400/50 to-blue-500/50 bg-clip-text text-6xl font-extrabold text-transparent md:text-8xl lg:text-9xl"
		>
			{message} <span class="mx-4 text-4xl text-slate-500">{description}</span>
		</h1>
	</div>
	<div class="mx-4 flex max-w-4xl justify-center py-5 text-center text-xl text-gray-500/75">
		{subMessage}
	</div>

	<div class="mb-5 flex flex-col items-center justify-start">
		<div class="mb-8 flex items-center gap-4">
			{#if data.session}
				<a
					href="/admin"
					class="rounded-md bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
				>
					Go to Dashboard
				</a>
				<form action="/auth?/signout" method="POST">
					<button
						type="submit"
						class="rounded-md bg-gray-500 px-4 py-2 text-lg font-semibold text-white transition-colors hover:bg-gray-600"
					>
						Sign Out
					</button>
				</form>
			{:else}
				<div class="flex flex-row items-center gap-4 sm:flex-row">
					<a
						href="/auth/register"
						class="rounded-md border border-gray-400/50 bg-blue-600 px-4 py-2 text-lg font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg"
					>
						Sign Up Now!
					</a>
					<a
						href="/auth"
						class="rounded-md border border-gray-400/50 bg-gray-500/50 px-4 py-2 text-lg font-semibold text-white transition-colors hover:bg-gray-600/75"
					>
						Login
					</a>
				</div>
			{/if}
		</div>
	</div>
	<div class="mb-5 flex flex-row items-center justify-start gap-4">
		<div class="flex flex-row items-center gap-2">
			<KeySquare class="h-5 w-5" />
			<span class="text-sm font-normal">Keytags</span>
		</div>
		<div class="flex flex-row items-center gap-2">
			<Tags class="h-5 w-5" />
			<span class="text-sm font-normal">Price Tags</span>
		</div>
		<div class="flex flex-row items-center gap-2">
			<Share2 class="h-5 w-5" />
			<span class="text-sm font-normal">Social Media</span>
		</div>
		<div class="flex flex-row items-center gap-2">
			<DatabaseZap class="h-5 w-5" />
			<span class="text-sm font-normal">Database Sync</span>
		</div>
	</div>
	<!-- Carousel -->
	<div class="w-full max-w-5xl">
		<Carousel.Root orientation="horizontal">
			<Carousel.Content>
				<Carousel.Item>
					<img src="/images/dashboard.png" alt="Dashboard" class="w-full" />
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
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
</main>
