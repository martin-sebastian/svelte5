<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<header
	class="fixed top-0 flex w-full justify-between border-b border-gray-500/50 bg-gray-900/50 py-2 backdrop-blur-lg"
>
	<svg
		id="Layer_1"
		class="ms-5 w-10"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
	>
		<path
			class="cls-1"
			d="M40.38,37.14c-3.38,1.95-12.53,7.2-15.64,9.01-.44.25-.97.25-1.42,0-6.52-3.71-13.05-7.42-19.59-11.11-.55-.31-.88-.9-.87-1.53.02-1.52.01-3.04,0-4.62,0-.39.41-.64.75-.45,2.94,1.64,13.76,7.72,19.61,11.03.5.28,1.1.27,1.59-.02,1.47-.86,2.96-1.69,4.44-2.53.18-.1.35-.21.58-.35-.2-.13-.35-.24-.5-.33-5.6-3.16-11.21-6.32-16.82-9.45-.61-.34-.98-.98-.97-1.67.03-2.3.02-6.32.02-8.1,0-.39.42-.63.76-.44,1.18.69,3.14,1.84,3.81,2.21.37.2.49.45.48.85-.02.71,0,1.43,0,2.14,0,.51.27.99.71,1.24,6.88,3.94,19.79,11.37,23.06,13.25.34.2.34.68,0,.88Z"
		/>
		<path
			class="cls-1"
			d="M8.7,4.72c-2.46-1.4-4.45-2.52-5.33-3.02-.23-.13-.5.04-.5.29-.02,2.61-.03,13.49-.04,19.12,0,.28.15.53.39.66,1.34.73,4.91,2.71,5.46,3.02l.03-20.08Z"
		/>
		<path
			class="cls-1"
			d="M36.12,20.47c-1.13-.68-5.26-3.06-6.27-3.65.01,0,.02-.01.03-.02l-6.05-3.49c-.09-.02-.19-.05-.27-.1-2.93-1.68-7.21-4.13-11.12-6.36-.41-.23-.91.07-.91.54v5.6l24.94,14.42c.13-.55.02-6.25.02-6.25,0,0-.14-.56-.37-.7Z"
		/>
		<path
			class="cls-1"
			d="M43.95,2.11c-3,1.69-10.84,6.16-16.54,9.42-.33.19-.32.65,0,.84l4.83,2.79c.15.09.34.09.49,0,1.97-1.13,3.93-2.26,5.92-3.4.32-.19.73.04.73.42,0,2.78,0,11.7-.01,16.34,0,.41.1.65.48.84.62.32,3.14,1.79,4.6,2.64.32.19.73-.05.73-.42V2.83c0-.63-.68-1.03-1.23-.72Z"
		/>
	</svg>
	<div class="me-5 flex justify-between">
		<a
			class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white hover:bg-blue-600/90"
			href="/"
			aria-label="Home"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
		</a>
		<a
			class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white hover:bg-blue-600/90"
			href="/demo/lucia">Lucia Demo</a
		>
		<a
			class="mx-1 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2 text-white hover:bg-blue-600/90"
			href="/markdown">Markdown Demo</a
		>
		<a
			class="mx-1 flex items-center gap-2 rounded-full border border-orange-500/50 bg-gray-900/50 px-5 py-2 text-white hover:bg-orange-500/90"
			href="https://local.drizzle.studio/"
			target="_blank"
			>Drizzle Studio
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5 antialiased opacity-50"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
				/>
			</svg>
		</a>
	</div>
</header>

<main
	class="flex h-full min-h-screen flex-col items-center bg-gray-900 bg-gradient-to-br from-gray-800 pt-20 text-white"
>
	{@render children()}
</main>

<footer
	class="fixed bottom-0 flex w-full justify-start border-t border-gray-500/50 bg-gray-900/50 py-2 text-white backdrop-blur-lg"
>
	<p class="mx-5 text-sm opacity-50">martinsebastian.io</p>
</footer>

<style>
	main {
		padding-top: 100px;
	}
	.cls-1 {
		fill: #ccc;
	}
	.cls-1:hover {
		fill: #235cd8;
		transform: scale(1.1);
	}
</style>
