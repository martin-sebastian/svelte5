<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	const { data } = $page;

	let message = 'Dealership Power Tools for Dealer Spike';
	let subMessage =
		'Dealer Ops connects to your Dealer Spike inventory and allows you to create keytags, hangtags, vehicle social media posts and more.';
</script>

<main class="align-start flex h-full min-h-screen w-full flex-col items-center pt-20">
	<div class="flex max-w-6xl flex-col items-center text-center">
		<h1
			class="my-5 bg-gradient-to-r from-gray-400/50 to-blue-500/50 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl lg:text-8xl"
		>
			{message}
		</h1>
	</div>
	<div class="my-5 flex max-w-4xl justify-center text-center text-2xl text-gray-500/75">
		{subMessage}
	</div>
	<div class="mb-10 flex flex-col items-center justify-start">
		<div class="mb-8 flex items-center gap-4">
			{#if data.session}
				<a
					href="/admin/vehicles"
					class="rounded-md bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
				>
					Go to Dashboard
				</a>
				<form action="/auth?/signout" method="POST">
					<button
						type="submit"
						class="rounded-md bg-gray-500 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-600"
					>
						Sign Out
					</button>
				</form>
			{:else}
				<div class="flex flex-col items-center gap-4 sm:flex-row">
					<a
						href="/auth/register"
						class="rounded-md bg-blue-500 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg"
					>
						Sign Up Now!
					</a>
					<a
						href="/auth"
						class="rounded-md bg-gray-600/50 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-600/75"
					>
						Sign In
					</a>
				</div>
			{/if}
		</div>

		<div class="w-2/3">
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
	</div>
</main>
