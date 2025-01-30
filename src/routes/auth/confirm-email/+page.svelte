<script lang="ts">
	import { Mail } from 'lucide-svelte';
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div
		class="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-gray-600/25 bg-gray-100/10 p-10 text-center shadow-md"
	>
		<Mail class="mb-6 h-12 w-12 text-blue-500" />
		<h1 class="mb-4 text-2xl font-bold">Check Your Email</h1>
		<p class="mb-6 text-gray-600">
			We've sent you a confirmation email. Please check your inbox and click the link to verify your
			account.
		</p>
		<div class="space-y-4">
			<p class="text-sm text-gray-500">
				Didn't receive the email? Check your spam folder or
				<a href="/auth/register" class="text-blue-500 hover:text-blue-600">try registering again</a>
			</p>
			<a
				href="/auth"
				class="inline-block rounded-md bg-gray-600/50 px-6 py-2 text-sm text-white transition-colors hover:bg-gray-600/75"
			>
				Return to Login
			</a>
		</div>
	</div>
</div>
