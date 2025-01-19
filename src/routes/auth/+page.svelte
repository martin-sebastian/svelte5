<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { z } from 'zod';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { supabase } from '$lib/supabaseClient';

	const loginSchema = z.object({
		email: z.string().email('Please enter a valid email'),
		password: z.string().min(6, 'Password must be at least 6 characters')
	});

	const { form, enhance, errors, message } = superForm(data.form, {
		validators: zodClient(loginSchema),
		onError: ({ result }) => {
			console.error('Login failed:', result.error);
		},
		onSuccess: async ({ result, form }) => {
			const { email, password } = form.data;
			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password
				});

				if (error) throw error;

				goto('/dashboard');
			} catch (error) {
				console.error('Login error:', error);
				// Handle error appropriately
			}
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card.Root class="w-[350px]">
		<Card.Header>
			<Card.Title>Login</Card.Title>
			<Card.Description>Enter your email and password to login</Card.Description>
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

				{#if $message}
					<p class="text-sm text-red-500">{$message}</p>
				{/if}

				<Button type="submit" class="w-full">Login</Button>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<a href="/auth/register" class="text-sm text-blue-500 hover:underline">
				Don't have an account? Register
			</a>
		</Card.Footer>
	</Card.Root>
</div>
