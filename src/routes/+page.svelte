<script>
	// @ts-ignore
	import DiJsBadge from 'svelte-icons/di/DiJsBadge.svelte';
	// @ts-ignore
	import DiHtml5 from 'svelte-icons/di/DiHtml5.svelte';
	// @ts-ignore
	import DiCss3Full from 'svelte-icons/di/DiCss3Full.svelte';
	// @ts-ignore
	import DiBootstrap from 'svelte-icons/di/DiBootstrap.svelte';
	// @ts-ignore
	import DiAngularSimple from 'svelte-icons/di/DiAngularSimple.svelte';
	// @ts-ignore
	import DiGithubBadge from 'svelte-icons/di/DiGithubBadge.svelte';
	// @ts-ignore
	import DiMysql from 'svelte-icons/di/DiMysql.svelte';
	// @ts-ignore
	import DiPostgresql from 'svelte-icons/di/DiPostgresql.svelte';
	// @ts-ignore
	import DiSqllite from 'svelte-icons/di/DiSqllite.svelte';
</script>

<main class="align-start flex h-full min-h-screen w-full flex-col items-center bg-gray-900/25">
	<div class="flex max-w-7xl flex-col items-center pt-20 text-center">
		<h1
			class="my-5 bg-gradient-to-r from-white to-blue-500/50 bg-clip-text text-8xl font-extrabold text-transparent"
		>
			Welcome to Martin's SvelteKit 5 Demos
		</h1>
	</div>
	<div class="mb-10 flex justify-center text-2xl">
		Svelte 5, Drizzle, Lucia, SQLite, Tailwind, TypeScript, Shadcn UI.
	</div>

	<div class="max-w-7xl">
		<div class="grid grid-cols-3 gap-4 xl:grid-cols-3">
			<div class="flex h-24 w-full flex-col rounded-xl border border-gray-700 p-4">
				<div class="flex flex-row">
					<div class="mx-1 flex h-8 items-center justify-center p-1">
						<DiJsBadge />
					</div>
					<div class="mx-1 flex h-8 items-start justify-center">
						<DiHtml5 />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiCss3Full />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiBootstrap />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiAngularSimple />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiGithubBadge />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiSqllite />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiMysql />
					</div>
					<div class="mx-1 flex h-8 items-center justify-center">
						<DiPostgresql />
					</div>
				</div>
				<h1 class="mt-2 text-xl font-bold">My most used technologies</h1>
			</div>
			<div class="col-span-2 h-24 w-full rounded-xl border border-gray-700 bg-gray-900/25">
				<div class="p-4">02</div>
			</div>
			<div class="col-span-2 h-24 w-full rounded-xl border border-gray-700 bg-gray-900/25">
				<div class="p-4">03</div>
			</div>
			<div class="h-24 w-full rounded-xl border border-gray-700 bg-gray-900/25">
				<div class="p-4">04</div>
			</div>
			<div class="h-24 w-full rounded-xl border border-gray-700 bg-gray-900/25">
				<div class="p-4">05</div>
			</div>
			<div class="col-span-2 h-24 w-full rounded-xl border border-gray-700 bg-gray-900/25">
				<div class="p-4">06</div>
			</div>
		</div>

		<div class="table">
			<div class="table-cell">Data Table 01</div>
		</div>

		<article class="max-w-7xl py-20">
			<p class="text-md py-5">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam elementum auctor enim quis
				vulputate. Donec varius, quam sed placerat varius, eros felis ultricies arcu, sed luctus mi
				ex ac orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce aliquet
				metus neque, ut aliquam eros aliquam quis. Integer et enim sem. Sed ac eros id neque tempor
				sodales. Maecenas blandit placerat sem. Proin fermentum, felis et sollicitudin molestie, mi
				tellus blandit nunc, ut fringilla enim ante non ligula. Suspendisse cursus dolor ac ex
				ornare, quis porta ex hendrerit. Aenean tristique felis quis purus molestie pharetra. Mauris
				ultricies congue ligula vel euismod. Orci varius natoque penatibus et magnis dis parturient
				montes, nascetur ridiculus mus. Vestibulum quis lectus tempor, porttitor felis quis,
				interdum est. Nulla lacinia ultricies sem vitae blandit.
			</p>
			<p class="text-md py-5">
				Aenean ante purus, rhoncus a sodales sit amet, sagittis vitae justo. Curabitur sit amet
				sapien lobortis, pharetra dui eget, aliquet odio. Maecenas viverra, leo a consequat
				porttitor, tellus ligula porta dolor, eu tincidunt sapien massa eget ante. Sed rhoncus purus
				metus, vel eleifend odio tincidunt sit amet. Integer tincidunt ornare purus non elementum.
				Maecenas tincidunt mattis ligula, sed porttitor sapien malesuada et. Praesent aliquet,
				mauris ut accumsan consectetur, ligula nisi aliquet elit, et sodales mauris velit sed purus.
				Vivamus nibh nibh, scelerisque eget placerat id, vehicula et erat. Praesent sagittis turpis
				lacus, eu venenatis ex tristique et.
			</p>
			<p class="text-md py-5">
				Etiam vitae ante eu tellus finibus tristique sit amet eget odio. Pellentesque nec arcu
				risus. Cras augue turpis, interdum ultricies tincidunt ut, aliquam nec enim. Nulla aliquam
				nunc quis auctor suscipit. Suspendisse et lorem velit. Nullam blandit vitae risus nec
				facilisis. In eget sollicitudin justo. Proin elementum quis sem et consequat. Nullam sed
				orci eget mauris volutpat placerat vel at arcu. Nullam vitae ultrices magna. Vivamus at
				vestibulum elit, id porttitor libero. Nunc congue ultrices libero et mollis. In pharetra
				dictum pharetra. Fusce sed pharetra elit, non imperdiet erat. Vivamus nunc massa, faucibus
				eu ligula sed, consequat condimentum quam. Suspendisse ipsum sapien, aliquet quis fringilla
				sit amet, euismod at risus. Suspendisse neque est, scelerisque eget vestibulum non, volutpat
				eget ligula. Sed lacus metus, convallis feugiat ex et, laoreet ullamcorper ipsum. Ut vel
				elit iaculis leo vestibulum facilisis. Nam sagittis orci ex, ac ultricies sapien faucibus
				et. Maecenas pulvinar consectetur maximus. Fusce sit amet faucibus neque. Vestibulum sit
				amet lacus non tellus porta lobortis in consectetur enim. Nulla mollis enim non libero
				convallis varius. Praesent sit amet lectus vitae lacus hendrerit viverra. Etiam cursus
				sapien in ante facilisis faucibus. Quisque aliquet, arcu sit amet viverra cursus, lorem
				lectus mollis urna, in elementum justo metus non metus. Phasellus tincidunt mollis justo, eu
				aliquam lacus sodales et. Vestibulum sem purus, efficitur sed risus in, commodo vulputate
				nisl. Nunc imperdiet leo tellus, quis cursus purus congue non. Fusce ut urna fringilla nulla
				ullamcorper feugiat. Curabitur dignissim id dui varius suscipit. Donec pharetra malesuada
				nisi, vitae commodo ipsum. Vestibulum venenatis orci sagittis gravida sodales. Orci varius
				natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris sed ipsum
				in erat fermentum tincidunt. Aliquam condimentum, lacus id rutrum maximus, quam leo luctus
				quam, vitae ultrices dolor odio a mi.
			</p>
		</article>
	</div>
</main>

<style>
	.grid-box {
		border-radius: 0.75rem;
		border: 1px solid rgb(55, 65, 81);
		background-color: rgb(15, 23, 42, 0.5);
		padding: 1.25rem;
		font-size: 3rem;
		font-weight: 700;
		width: 100%;
		min-width: 24rem;
		min-height: 8rem;
	}
</style>
