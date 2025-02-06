<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Mail, Loader2 } from 'lucide-svelte';
</script>

<div class="flex min-h-screen items-center justify-center">
	<Card class="w-[350px]">
		<CardHeader class="text-center">
			<div class="mb-4 flex justify-center">
				<Mail class="h-12 w-12 text-gray-500" />
			</div>
			<CardTitle class="text-2xl">Check your email</CardTitle>
			<CardDescription>We've sent you a magic link to sign in</CardDescription>
		</CardHeader>
		<CardContent class="text-center">
			<Loader2 class="mx-auto h-6 w-6 animate-spin text-gray-500" />
			<p class="mt-4 text-sm text-gray-500">Click the link in your email to continue</p>
		</CardContent>
	</Card>
</div>
