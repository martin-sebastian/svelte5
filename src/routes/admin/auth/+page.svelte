<script lang="ts">
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
	<h1 class="my-5 text-3xl font-bold">Hi, {data.user.firstName}!</h1>
	<p class="my-2 text-lg font-bold">
		{data.user.firstName}
		{data.user.lastName}
	</p>
	<div class="nav my-5">
		<Button href="/admin/vehicles">Dashboard</Button>

		<form method="POST" action="?/logout">
			<Button type="submit">Logout</Button>
		</form>
	</div>
</div>
