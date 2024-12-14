<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<header
	class="fixed top-0 flex h-14 w-full justify-between border-b border-gray-500/50 bg-gray-900/50 backdrop-blur-lg"
>
	<div class="logo">
		<a href="/" aria-label="Home">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				id="Layer_1"
				class="m-3 size-8 hover:scale-110"
				data-name="Layer 1"
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
		</a>
	</div>
	<div class="flex flex-row justify-between py-2">
		<a
			class="mx-1 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 text-white hover:bg-blue-600/50"
			href="/"
			aria-label="Home"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
		</a>
		<a
			class="mx-1 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 text-white hover:bg-blue-600/50"
			href="/demo/inventory"
			aria-label="Inventory"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				><path d="M12 3v18" /><rect width="18" height="18" x="3" y="3" rx="2" /><path
					d="M3 9h18"
				/><path d="M3 15h18" /></svg
			>
		</a>
		<a
			class="mx-1 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 text-white hover:bg-blue-600/50"
			href="/demo/lucia"
			aria-label="Authentication Demo"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				><path
					d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"
				/><path d="m14 7 3 3" /><path
					d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"
				/></svg
			>
		</a>
		<a
			class="mx-1 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 text-white hover:bg-blue-600/50"
			href="/markdown"
			aria-label="Markdown Demo"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				><path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="m17 12 3-2v8" /></svg
			>
		</a>
		<a
			class="mx-1 flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 text-white hover:bg-blue-600/50"
			href="https://local.drizzle.studio/"
			target="_blank"
			aria-label="Drizzle Studio"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 15 21.84" /><path
					d="M21 5V8"
				/><path d="M21 12L18 17H22L19 22" /><path d="M3 12A9 3 0 0 0 14.59 14.87" /></svg
			>
		</a>
	</div>
</header>

<main
	class="bg flex h-screen w-full flex-col items-center bg-gray-900 bg-gradient-to-br from-gray-800 text-white"
>
	{@render children()}
</main>

<footer
	class="fixed bottom-0 flex w-full justify-start border-t border-gray-500/50 bg-gray-900/50 text-white backdrop-blur-lg"
>
	<p class="mx-5 py-2 text-sm opacity-50">martinsebastian.io</p>
</footer>

<style>
	.bg {
		height: 100%;
		background-color: #141c2a;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23171F2E' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%231E2835'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");
		background-size: 400px 400px;
		background-position: top-left;
		background-repeat: repeat;
	}
	.cls-1 {
		fill: #ccc;
	}
	.cls-1:hover {
		fill: #235cd8;
		transform: scale(1.1);
	}
</style>
