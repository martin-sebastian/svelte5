import { writable } from 'svelte/store';

// Define types
type Template = {
  id: string;
  name: string;
  width: string;
  height: string;
  orientation: string;
  description: string;
};

type Vehicle = {
  id: string;
  name: string;
  // ... other vehicle properties
};

type KeyTagState = {
  vehicleId: string | null;
  selectedTemplateId: string | null;
  vehicle: Vehicle | null;
  isLoading: boolean;
  templates: Template[];
  zoom: number;
};

// Create store instead of $state
export const keyTagState = writable<KeyTagState>({
  vehicleId: null,
  selectedTemplateId: null,
  vehicle: null,
  isLoading: false,
  templates: [], // Will be populated with available templates
  zoom: 1
});

// Actions
export function setTemplate(templateId: string) {
  keyTagState.update(state => ({ ...state, selectedTemplateId: templateId }));
}

export function setZoom(zoom: number) {
  keyTagState.update(state => ({ ...state, zoom: Math.max(0.5, Math.min(2, zoom)) }));
}

export async function loadVehicleData(id: string) {
  keyTagState.update(state => ({ ...state, isLoading: true }));
  try {
    // Replace with your actual API call
    const response = await fetch(`/api/vehicles/${id}`);
    const vehicle = await response.json();
    keyTagState.update(state => ({ 
      ...state, 
      vehicle,
      vehicleId: id,
      isLoading: false 
    }));
  } catch (error) {
    console.error('Failed to load vehicle:', error);
    keyTagState.update(state => ({ ...state, isLoading: false }));
  }
} 