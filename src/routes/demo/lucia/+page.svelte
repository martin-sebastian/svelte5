<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { badgeVariants } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageServerData } = $props();
	let age = data.age;
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<Avatar.Root>
		<Avatar.Image src="https://martinsebastian.co/avatar/martin.png" alt="Martin" />
		<Avatar.Fallback>MS</Avatar.Fallback>
	</Avatar.Root>
	<h1 class="text-3xl font-bold">Hi, {data.user.firstName}!</h1>
	<p class="my-1 text-xl">Your user ID: {data.user.id}</p>
	<p class="my-1 text-xl">{data.firstName} {data.lastName} age: {data.age}</p>
	<Badge class="my-5 bg-red-500 text-current hover:bg-red-700">Age {age}</Badge>
	<div class="nav my-5">
		<a
			href="/"
			class={badgeVariants({
				variant: 'outline',
				className: 'text-current hover:bg-white hover:text-black'
			})}>Dashboard</a
		>
		<a
			href="/demo/lucia"
			class={badgeVariants({
				variant: 'outline',
				className: 'text-current hover:bg-white hover:text-black'
			})}>My Profile</a
		>
	</div>
	<div class="nav my-5">
		<Button variant="outline">Button</Button>
		<Button class="bg-red-500 hover:bg-red-700">Button</Button>
	</div>
	<form method="post" action="?/logout" use:enhance>
		<button class="rounded-md bg-blue-500 px-2 py-2 text-white hover:bg-blue-700">Sign out</button>
		<Button class="bg-red-500 hover:bg-red-700">Sign Out Two</Button>
	</form>
</div>
