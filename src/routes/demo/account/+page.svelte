<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/Button.svelte';
	import { Badge, badgeVariants } from '$lib/components/ui/badge';

	let { data }: { data: PageServerData } = $props();
	let age = data.age;
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<Avatar.Root>
		<Avatar.Image src="https://martinsebastian.co/avatar/martin.png" alt="Martin Sebastian" />
		<Avatar.Fallback>MS</Avatar.Fallback>
	</Avatar.Root>
	<h1 class="my-5 text-3xl font-bold">Hi, {data.user.firstName}!</h1>
	<div class="nav my-5">
		<a
			href="/"
			class={badgeVariants({
				variant: 'outline',
				className: 'text-current hover:bg-white hover:text-black'
			})}>Dashboard</a
		>
		<a
			href="/demo/account"
			class={badgeVariants({
				variant: 'outline',
				className: 'text-current hover:bg-white hover:text-black'
			})}>My Profile</a
		>
	</div>
	<p class="my-2 text-xl">Your ID: {data.user.id}</p>
	<p class="my-2 text-xl">
		{data.firstName}
		{data.lastName}
		<Badge class="bg-red-500 py-3 text-current hover:bg-red-700">Age {age}</Badge>
	</p>
	<form method="post" action="?/logout" use:enhance>
		<Button variant="outline" aria-label="Sign out">Sign out</Button>
	</form>
</div>
