import { writable } from 'svelte/store';

// Define the Vehicle interface directly in this file
interface Vehicle {
    id: string;
    title?: string;
    manufacturer?: string;
    year?: number;
    vin?: string;
    stockNumber?: string;
    price?: string | number;
    images?: { id: string; image_url: string; }[];
    // Add other properties as needed
}

// Export the type for use in other files
export type { Vehicle };

// Use standard Svelte stores instead of runes
export const vehicle = writable<Vehicle | null>(null);
export const selectedTemplateId = writable('standard');
export const zoom = writable(1);
export const isLoading = writable(false);

// Helper functions to update stores
export function setVehicleData(vehicleData: Vehicle) {
    vehicle.set(vehicleData);
}

export function setTemplate(templateId: string) {
    selectedTemplateId.set(templateId);
}

export function setZoom(newZoom: number) {
    zoom.update(z => Math.max(0.5, Math.min(2, newZoom)));
}

export function setLoading(loading: boolean) {
    isLoading.set(loading);
}

// Async data loading
export async function loadVehicleData(id: string) {
    isLoading.set(true);
    try {
        const response = await fetch(`/admin/vehicles/keytag/${id}`);
        const data = await response.json();
        vehicle.set(data.vehicle);
    } catch (error) {
        console.error('Failed to load vehicle:', error);
    } finally {
        isLoading.set(false);
    }
}