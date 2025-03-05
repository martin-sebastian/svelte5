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
    
    // Add properties used in templates
    modelName?: string;
    modelType?: string;
    color?: string;
    usage?: string;
    metricValue?: number | string;
    metricType?: string;
}

// Export the type for use in other files
export type { Vehicle };

// Use standard Svelte stores instead of runes
export const vehicle = writable<Vehicle | null>(null);
export const selectedTemplateId = writable('standard');
export const zoom = writable(1);
export const isLoading = writable(false);

// Helper functions to update stores
export function setVehicleData(vehicleData: Record<string, unknown>) {
    // Log the raw vehicle data
    console.log('Raw vehicle data:', vehicleData);
    
    // Map database column names to expected property names
    const mappedData: Vehicle = {
        id: String(vehicleData.id || ''),
        title: vehicleData.title as string | undefined,
        manufacturer: vehicleData.manufacturer as string | undefined,
        year: vehicleData.year as number | undefined,
        vin: vehicleData.vin as string | undefined,
        stockNumber: (vehicleData.stockNumber || vehicleData.stock_number) as string | undefined,
        price: vehicleData.price as string | number | undefined,
        images: vehicleData.images as { id: string; image_url: string; }[] | undefined,
        
        // Map snake_case to camelCase if needed
        modelName: (vehicleData.modelName || vehicleData.model_name) as string | undefined,
        modelType: (vehicleData.modelType || vehicleData.model_type) as string | undefined,
        color: vehicleData.color as string | undefined,
        usage: (vehicleData.usage || vehicleData.condition) as string | undefined,
        metricValue: (vehicleData.metricValue || vehicleData.metric_value) as number | string | undefined,
        metricType: (vehicleData.metricType || vehicleData.metric_type) as string | undefined
    };
    
    // Log the mapped data
    console.log('Mapped vehicle data:', mappedData);
    
    vehicle.set(mappedData);
}

export function setTemplate(templateId: string) {
    selectedTemplateId.set(templateId);
}

export function setZoom(newZoom: number) {
    zoom.set(Math.max(0.5, Math.min(2, newZoom)));
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