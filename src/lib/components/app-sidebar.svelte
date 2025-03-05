<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Calendar from 'lucide-svelte/icons/calendar';
	import LaptopMinimal from 'lucide-svelte/icons/laptop-minimal';
	import Bike from 'lucide-svelte/icons/bike';
	import House from 'lucide-svelte/icons/house';
	import Inbox from 'lucide-svelte/icons/inbox';
	import DatabaseZap from 'lucide-svelte/icons/database-zap';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ShieldPlus, LogOut } from 'lucide-svelte';

	// Menu items.
	const items = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Dashboard',
			url: '/admin',
			icon: LaptopMinimal
		},
		{
			title: 'Vehicles',
			url: '/admin/vehicles',
			icon: Bike
		}
	];
	// Menu items.
	const footerItems = [
		{
			title: 'A.I.',
			url: '/admin/ai',
			icon: Calendar
		},
		{
			title: 'Sync',
			url: '/admin/sync',
			icon: DatabaseZap
		},
		{
			title: 'Settings',
			url: '/admin/settings',
			icon: Settings
		}
	];
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					<Avatar.Root class="h-4 w-4">
						<Avatar.Image src="https://github.com/shadcn.png" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			{#each footerItems as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
