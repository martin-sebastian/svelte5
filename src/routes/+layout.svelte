<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<header
	class="fixed top-0 flex w-full justify-center border-b border-gray-800 bg-gray-900/50 py-2 backdrop-blur-lg"
>
	<div class="flex justify-center">
		<a class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white" href="/"
			>Home</a
		>
		<a
			class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white"
			href="/demo/lucia">Lucia Demo</a
		>
		<a
			class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white"
			href="/markdown">Markdown Demo</a
		>
		<a
			class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white"
			href="https://local.drizzle.studio/"
			target="_blank">Drizzle Studio</a
		>
	</div>
</header>

<main
	class="flex h-screen flex-col items-center bg-gray-900 bg-gradient-to-br from-gray-800 pt-20 text-white"
>
	{@render children()}
</main>

<footer class="fixed bottom-0 flex w-full justify-center">
	<p>Footer</p>
</footer>

<style>
	main {
		padding-top: 100px;
	}
</style>
