<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance>
	<Form.Root>
		<Form.Field {form} name="email">
			<Form.Label>Email</Form.Label>
			<Form.Control>
				<Input type="email" bind:value={$form.email} placeholder="Enter your email" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Label>Password</Form.Label>
			<Form.Control>
				<Input type="password" bind:value={$form.password} placeholder="Enter your password" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Button type="submit">Login</Button>
	</Form.Root>
</form>
