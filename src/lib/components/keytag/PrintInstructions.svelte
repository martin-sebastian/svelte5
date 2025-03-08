<script lang="ts">
	// This component provides instructions for printing key tags
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
</script>

<div
	class="print-instructions rounded-lg border border-gray-400/25 bg-gray-50 p-4 text-sm dark:bg-gray-900/90"
>
	<Collapsible.Root>
		<Collapsible.Trigger class="flex w-full items-center justify-between font-semibold">
			<span>Printing Instructions</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="collapsible-icon"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div class="mt-2">
				<p class="mb-1">For best results when printing key tags:</p>
				<ol class="ml-5 list-decimal">
					<li>Use the "Print" button to open a print-optimized view</li>
					<li>In your browser's print dialog, set the following options:</li>
				</ol>

				<ul class="ml-5 mt-2 list-disc">
					<li><strong>Paper size:</strong> Letter or A4</li>
					<li><strong>Scale:</strong> 100% (do not scale)</li>
					<li><strong>Margins:</strong> None</li>
					<li>
						<strong>Background graphics:</strong> Enabled (important for colored elements)
						<ul class="ml-4 mt-1 list-disc text-xs">
							<li>Chrome: Check "Background graphics"</li>
							<li>Firefox: Check "Print backgrounds"</li>
							<li>Safari: Check "Print backgrounds"</li>
						</ul>
					</li>
				</ul>

				<p
					class="mt-2 rounded border border-yellow-200 bg-yellow-50 p-2 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
				>
					Note: If colors or backgrounds don't print correctly, make sure "Print backgrounds" is
					enabled in your browser's print settings.
				</p>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>

<style>
	/* Hide in print view */
	@media print {
		.print-instructions {
			display: none;
		}
	}

	:global(.collapsible-icon) {
		transition: transform 0.2s ease;
	}

	:global([data-state='open'] .collapsible-icon) {
		transform: rotate(180deg);
	}
</style>
