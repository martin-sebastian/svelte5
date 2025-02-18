// Pure Svelte 5 state
export const keyTagDrawerState = $state({
    isOpen: false,
    vehicleId: null as string | null
});

// State mutations in functions
export function openKeyTagDrawer(vehicleId: string) {
    keyTagDrawerState.isOpen = true;
    keyTagDrawerState.vehicleId = vehicleId;
}

export function closeKeyTagDrawer() {
    keyTagDrawerState.isOpen = false;
    keyTagDrawerState.vehicleId = null;
} 