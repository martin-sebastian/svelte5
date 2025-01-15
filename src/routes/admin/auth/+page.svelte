<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageServerData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<Avatar.Root>
		<Avatar.Image src="https://martinsebastian.co/avatar/martin.png" alt="Martin Sebastian" />
		<Avatar.Fallback>MS</Avatar.Fallback>
	</Avatar.Root>
	{#if data.user}
		<h1 class="my-5 text-3xl font-bold">Hi, {data.user.username}!</h1>
		<p class="my-2 text-lg font-bold">
			{data.user.firstName}
			{data.user.lastName}
			{data.user.age}
		</p>
		<p class="my-2 text-lg font-bold">
			User ID: {data.user.id}
		</p>
	{/if}
	<div class="my-5 flex flex-row gap-2">
		<Button href="/admin/vehicles">Dashboard</Button>

		<form method="POST" action="?/logout" use:enhance>
			<Button type="submit">Logout</Button>
		</form>
	</div>
</div>
