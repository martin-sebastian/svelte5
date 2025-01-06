<script>
	let message = "Welcome to Martin's SvelteKit 5 Demos";
	let subMessage = 'Svelte 5, Drizzle, Lucia, SQLite, Tailwind, TypeScript, Shadcn UI.';
	let technologyIcons = [
		{ name: 'HTML', icon: DiHtml5 },
		{ name: 'CSS', icon: DiCss3Full },
		{ name: 'JavaScript', icon: DiJsBadge },
		{ name: 'MySQL', icon: DiMysql },
		{ name: 'PostgreSQL', icon: DiPostgresql }
	];
	let languageIcons = [
		{ name: 'HTML', icon: DiHtml5 },
		{ name: 'CSS', icon: DiCss3Full },
		{ name: 'JavaScript', icon: DiJsBadge }
	];
	let frameworkIcons = [
		{ name: 'Bootstrap', icon: DiBootstrap },
		{ name: 'Angular', icon: DiAngularSimple },
		{ name: 'GitHub', icon: DiGithubBadge }
	];
	let databaseIcons = [
		{ name: 'SQLite', icon: DiSqllite },
		{ name: 'MySQL', icon: DiMysql },
		{ name: 'PostgreSQL', icon: DiPostgresql }
	];
	let toolIcons = [
		{ name: 'GitHub', icon: DiGithubBadge },
		{ name: 'Bootstrap', icon: DiBootstrap },
		{ name: 'Angular', icon: DiAngularSimple },
		{ name: 'GitHub', icon: DiGithubBadge },
		{ name: 'MySQL', icon: DiMysql },
		{ name: 'PostgreSQL', icon: DiPostgresql }
	];

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

<main class="align-start flex h-full min-h-screen w-full flex-col items-center">
	<div class="flex max-w-7xl flex-col items-center pt-20 text-center">
		<h1
			class="my-5 bg-gradient-to-r from-gray-400/50 to-blue-500/50 bg-clip-text text-8xl font-extrabold text-transparent"
		>
			{message}
		</h1>
	</div>
	<div class="mb-10 flex justify-center text-2xl text-gray-500/75">
		{subMessage}
	</div>

	<div class="max-w-8xl">
		<div class="grid grid-cols-3 gap-4 xl:grid-cols-4">
			<div class="col-span-2 h-36 w-full rounded-xl border border-gray-400/25 bg-background">
				<div class="p-4">01 Programming Languages</div>
				<div class="flex flex-row items-center justify-start">
					{#each languageIcons as language}
						<div class="flex-start h-8 items-center justify-start">
							<svelte:component
								this={language.icon}
								alt={language.name}
								title={language.name}
								class="h-6 w-6 text-muted-foreground"
							/>
							<span class="m-2 text-sm text-muted-foreground">{language.name}</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="h-36 w-full rounded-xl border border-gray-400/25 bg-background">
				<div class="p-4">02</div>
				<div class="flex flex-row items-center justify-start">
					{#each frameworkIcons as framework}
						<div class="flex-start h-8 items-center justify-start">
							<svelte:component
								this={framework.icon}
								alt={framework.name}
								title={framework.name}
								class="h-6 w-6 text-muted-foreground"
							/>
							<span class="m-2 text-sm text-muted-foreground">{framework.name}</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="h-36 w-full rounded-xl border border-gray-400/25 bg-background">
				<div class="p-4">03</div>
			</div>
			<div class="h-36 w-full rounded-xl border border-gray-400/25 bg-background">
				<div class="p-4">04</div>
			</div>
			<div class="h-36 w-full rounded-xl border border-gray-400/25 bg-background">
				<div class="p-4">05</div>
			</div>
			<div class="col-span-2 h-36 w-full rounded-xl border border-gray-400/25 bg-background">
				<div class="p-4">06</div>
			</div>
		</div>
	</div>
	<div class="my-10 flex flex-col items-center justify-start">hello</div>
</main>
