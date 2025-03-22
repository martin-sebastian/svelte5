<script lang="ts">
	import type { PageData } from './$types';
	let { motorcycle }: PageData = $props();
</script>

<h1>{motorcycle.title} Details</h1>

<p>ID: {motorcycle.id}</p>
<p>Price: {motorcycle.price}</p>
<p>Stock Number: {motorcycle.stock_number}</p>
<p>Description: {motorcycle.description}</p>
