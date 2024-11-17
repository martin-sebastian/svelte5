<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1 class="text-3xl font-bold">Hi, {data.user.username}!</h1>
<p class="my-5 text-xl">Your user ID: {data.user.id}</p>
<form method="post" action="?/logout" use:enhance>
	<button class="rounded-md bg-blue-500 px-2 py-2 text-white">Sign out</button>
</form>
