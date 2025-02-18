import { writable } from 'svelte/store';

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    images: { id: string; image_url: string; }[];
    // Add other vehicle properties as needed
}

// Stores single vehicle data
// Used only for the keytag drawer/view
export const vehicleData = writable<Vehicle | null>(null);

// Pure Svelte 5 state
export const keyTagState = $state({
    vehicle: null as Vehicle | null,
    selectedTemplateId: 'standard',
    zoom: 1,
    isLoading: false
});

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

// Async data loading with Svelte 5 state mutations
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