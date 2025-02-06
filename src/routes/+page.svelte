<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { CircleGauge } from 'lucide-svelte';
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center">
	<h1 class="mb-8 text-4xl font-bold">Welcome to DealerOps</h1>
	<p class="mb-8 text-xl text-gray-600">Streamline your dealership operations</p>
	<div class="space-x-4">
		<Button href="/auth/login" variant="default">Login</Button>
		<Button href="/auth/register" variant="outline">Register</Button>
		<Button href="/admin">
			<CircleGauge class="mr-2 h-4 w-4" />
			Admin Dashboard
		</Button>
	</div>
</div>
