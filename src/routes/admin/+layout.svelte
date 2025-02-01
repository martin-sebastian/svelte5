<script lang="ts">
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import { Button } from '$lib/components/ui/button';
	import { ShieldPlus, Sun, Moon, User, Settings, LayoutDashboard, Bike } from 'lucide-svelte';

	let theme = $state<'light' | 'dark'>(
		typeof localStorage !== 'undefined'
			? (localStorage.getItem('theme') as 'light' | 'dark') ||
					(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: 'light'
	);

	$effect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}

	// Protect all admin routes
	const { data } = $page;
	$effect(() => {
		if (!data.session) {
			throw redirect(303, '/auth');
		}
	});
</script>

<nav
	class="fixed z-40 flex w-full justify-center border-b bg-background/50 py-1 shadow-sm backdrop-blur-sm print:hidden"
>
	<div class="flex items-center">
		<a href="/" class="mx-4 p-1" aria-label="Home">
			<div class="flex flex-row items-center">
				<ShieldPlus class="h-8 w-8" />
				<div class="hidden sm:flex">
					<span class="font-bold">DEALER</span><span class="font-black">OPS</span>
				</div>
			</div>
		</a>
		<Button href="/admin" variant="outline" class="mx-1 p-3">
			<LayoutDashboard /> <span class="hidden sm:block">Dashboard</span>
		</Button>
		<Button href="/admin/vehicles" variant="outline" class="mx-1 p-3">
			<Bike /> <span class="hidden sm:block">Inventory</span>
		</Button>
	</div>
	<div class="flex-grow justify-center gap-0 align-middle" />
	<div class="flex flex-row items-center justify-end">
		<Button onclick={toggleTheme} variant="outline" class="mx-1 my-1">
			<Sun class="dark:hidden" />
			<Moon class="hidden dark:block" />
		</Button>
		<Button href="/auth" variant="outline" class="mx-1 my-1">
			<User class="h-4 w-4" />
		</Button>
		<Button href="/admin/settings" variant="outline" class="my-1 ml-1 mr-2">
			<Settings class="h-4 w-4" />
		</Button>
	</div>
</nav>

<slot />
