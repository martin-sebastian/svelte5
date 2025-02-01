<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ShieldPlus, Sun, Moon, User } from 'lucide-svelte';
	import { theme } from '$lib/theme';
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
	</div>
	<div class="flex-grow justify-center gap-0 align-middle"></div>
	<div class="flex flex-row items-center justify-end">
		<Button onclick={() => theme.toggle()} variant="outline" class="mx-1 my-1">
			<Sun class="dark:hidden" />
			<Moon class="hidden dark:block" />
		</Button>
		<Button href="/auth" variant="outline" class="mx-1 my-1">
			<User class="h-4 w-4" />
		</Button>
	</div>
</nav>
