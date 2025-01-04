<script lang="ts">
	interface $$Props {
		variant?: 'default' | 'outline';
		size?: 'default' | 'icon';
		className?: string;
		'aria-label'?: string;
	}

	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let className: $$Props['className'] = '';
</script>

<button
	class="{className} inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
    {variant === 'outline'
		? 'border border-input hover:bg-accent hover:text-accent-foreground'
		: 'bg-primary text-primary-foreground hover:bg-primary/90'}
    {size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'}"
	on:click
>
	<slot />
</button>
