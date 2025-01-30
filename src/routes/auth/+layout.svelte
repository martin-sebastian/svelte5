<script>
	let { children } = $props();
	import { MonitorDot, CircleUser } from 'lucide-svelte';
</script>

<header
	class="group fixed flex h-screen w-[56px] flex-col items-start justify-center border-r border-gray-600/25 bg-gray-900/50 py-1 shadow-sm backdrop-blur-sm hover:w-[150px] print:hidden"
>
	<nav>
		<div
			class="flex w-[50px] flex-col items-start justify-center bg-gray-800/25 p-4 transition-all duration-200 hover:bg-gray-800/50 group-hover:w-[150px]"
		>
			<a href="/" class="flex items-center gap-2 whitespace-nowrap">
				<MonitorDot class="h-4 w-4" />
				<span
					class="overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:opacity-100"
					>Dashboard</span
				>
			</a>
		</div>
		<div
			class="flex w-[50px] flex-col items-start justify-center bg-gray-800/25 p-4 transition-all duration-200 hover:bg-gray-800/50 group-hover:w-[150px]"
		>
			<a href="/profile" class="flex items-center gap-2 whitespace-nowrap">
				<CircleUser class="h-4 w-4" />
				<span
					class="overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:opacity-100"
					>User Profile</span
				>
			</a>
		</div>
	</nav>
</header>
<main class="flex min-h-screen flex-col bg-background align-middle text-foreground">
	{@render children()}
</main>
