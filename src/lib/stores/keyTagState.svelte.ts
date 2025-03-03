import type { Vehicle } from '$lib/types';

// Pure Svelte 5 state
export const keyTagState = {
    vehicle: $state<Vehicle | null>(null),
    selectedTemplateId: $state('standard'),
    zoom: $state(1),
    isLoading: $state(false)
};

// Direct state mutations
export function setVehicleData(vehicle: Vehicle) {
    keyTagState.vehicle = vehicle;
}

export function setTemplate(templateId: string) {
    keyTagState.selectedTemplateId = templateId;
}

export function setZoom(newZoom: number) {
    keyTagState.zoom = Math.max(0.5, Math.min(2, newZoom));
}

export function setLoading(loading: boolean) {
    keyTagState.isLoading = loading;
}

// Async data loading
export async function loadVehicleData(id: string) {
    keyTagState.isLoading = true;
    try {
        const response = await fetch(`/admin/vehicles/keytag/${id}`);
        const data = await response.json();
        keyTagState.vehicle = data.vehicle;
    } catch (error) {
        console.error('Failed to load vehicle:', error);
    } finally {
        keyTagState.isLoading = false;
    }
} 