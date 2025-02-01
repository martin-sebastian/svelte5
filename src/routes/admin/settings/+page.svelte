<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { User, Mail, Phone, LogOut } from 'lucide-svelte';
	import { supabase } from '$lib/supabaseClient';

	let user = $state({
		email: $page.data.user?.email || '',
		firstName: $page.data.user?.user_metadata?.firstName || '',
		lastName: $page.data.user?.user_metadata?.lastName || '',
		phone: $page.data.user?.user_metadata?.phone || ''
	});

	let isSaving = $state(false);

	$effect(() => {
		// Update form when page.form changes (after form submission)
		if ($page.form?.success) {
			isSaving = false;
		}
	});

	async function handleSignOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			goto('/auth');
		} catch (error: any) {
			console.error('Error signing out:', error.message || 'Unknown error occurred');
		}
	}
</script>

<div class="container mx-auto space-y-4 p-4 pt-20">
	<Card>
		<CardHeader>
			<CardTitle>Profile Settings</CardTitle>
			<CardDescription>Update your personal information and preferences.</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				class="space-y-4"
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					isSaving = true;
					return async ({ update }) => {
						await update();
					};
				}}
			>
				<div class="space-y-2">
					<Label for="email">
						<Mail class="mr-2 inline h-4 w-4" />
						Email
					</Label>
					<Input id="email" type="email" value={user.email} disabled class="dark:text-white" />
				</div>

				<div class="space-y-2">
					<Label for="firstName">
						<User class="mr-2 inline h-4 w-4" />
						First Name
					</Label>
					<Input
						id="firstName"
						name="firstName"
						type="text"
						value={user.firstName}
						class="dark:text-white"
					/>
				</div>

				<div class="space-y-2">
					<Label for="lastName">
						<User class="mr-2 inline h-4 w-4" />
						Last Name
					</Label>
					<Input
						id="lastName"
						name="lastName"
						type="text"
						value={user.lastName}
						class="dark:text-white"
					/>
				</div>

				<div class="space-y-2">
					<Label for="phone">
						<Phone class="mr-2 inline h-4 w-4" />
						Phone Number
					</Label>
					<Input id="phone" name="phone" type="tel" value={user.phone} class="dark:text-white" />
				</div>

				{#if $page.form?.error}
					<p class="text-red-500">{$page.form.error}</p>
				{/if}

				{#if $page.form?.success}
					<p class="text-green-500">Profile updated successfully!</p>
				{/if}

				<div class="flex items-center justify-between pt-4">
					<Button type="submit" disabled={isSaving}>
						{isSaving ? 'Saving...' : 'Save Changes'}
					</Button>
					<Button variant="destructive" onclick={() => handleSignOut()}>
						<LogOut class="mr-2 h-4 w-4" />
						Sign Out
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
