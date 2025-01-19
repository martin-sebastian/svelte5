<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { z } from 'zod';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';

	const registerSchema = z
		.object({
			email: z.string().email(),
			password: z.string().min(6),
			confirmPassword: z.string().min(6)
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ['confirmPassword']
		});

	const { form, enhance, errors } = superForm(data.form, {
		validators: zodClient(registerSchema)
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card.Root class="w-[350px]">
		<Card.Header>
			<Card.Title>Register</Card.Title>
			<Card.Description>Create a new account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" use:enhance class="space-y-4">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} type="email" placeholder="Enter your email" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input {...props} type="password" placeholder="Enter your password" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="confirmPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Confirm Password</Form.Label>
							<Input {...props} type="password" placeholder="Confirm your password" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Button type="submit" class="w-full">Register</Button>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<a href="/auth" class="text-sm text-blue-500 hover:underline">
				Already have an account? Login
			</a>
		</Card.Footer>
	</Card.Root>
</div>
