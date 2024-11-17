<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<div
		class="flex h-96 w-96 flex-col items-center rounded-xl border border-gray-800 bg-slate-900/50 p-10 align-middle"
	>
		<h1 class="my-5 text-3xl font-bold">Login or Register</h1>
		<form method="post" action="?/login" use:enhance>
			<label>
				<input
					class="bg-gring-gray-950 my-1 w-full rounded border border-gray-700"
					name="username"
				/>
			</label>
			<label>
				<input
					class="bg-gring-gray-950 my-1 w-full rounded border border-gray-700"
					type="password"
					name="password"
				/>
			</label>
			<button class="my-1 w-full rounded bg-blue-500 p-2">Login</button>
			<p class="my-1 text-center text-gray-400">or</p>
			<button formaction="?/register" class="my-1 w-full rounded bg-slate-500 p-2">Register</button>
		</form>
		<p style="color: red">{form?.message ?? ''}</p>
	</div>
</div>
