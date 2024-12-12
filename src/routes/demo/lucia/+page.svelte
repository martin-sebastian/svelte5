<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<h1 class="text-3xl font-bold">Hi, {data.user.username}!</h1>
	<p class="my-5 text-xl">Your user ID: {data.user.id}</p>
	<p class="my-5 text-xl">Your Age Is: {data.user.age}</p>
	<form method="post" action="?/logout" use:enhance>
		<button class="rounded-md bg-blue-500 px-2 py-2 text-white hover:bg-blue-700">Sign out</button>
	</form>
</div>
