<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<Avatar.Root>
		<Avatar.Image src="https://martinsebastian.co/avatar/martin.png" alt="Martin" />
		<Avatar.Fallback>MS</Avatar.Fallback>
	</Avatar.Root>
	<h1 class="text-3xl font-bold">Hi, {data.user.firstName}!</h1>
	<p class="my-5 text-xl">Your user ID: {data.user.id}</p>
	<p class="my-5 text-xl">Your Age Is: {data.age}</p>
	<p class="my-5 text-xl">First Name: {data.firstName}</p>
	<p class="my-5 text-xl">Last Name: {data.lastName}</p>
	<form method="post" action="?/logout" use:enhance>
		<button class="rounded-md bg-blue-500 px-2 py-2 text-white hover:bg-blue-700">Sign out</button>
	</form>
</div>
