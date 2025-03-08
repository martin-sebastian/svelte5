import type { TemplateId } from './types';

// Define the mapping between template IDs and Meta Names
export const templateMetaNames: Record<TemplateId, string> = {
  'standard': 'Standard Key Tag',
  'standard_yellow': 'Yellow Standard Key Tag',
  'gray': 'Gray Professional Key Tag',
  'white': 'White Clean Key Tag',
  'white_custom': 'Custom White Key Tag'
};

// Define additional metadata for templates
export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  width: string;
  height: string;
  orientation: 'Portrait' | 'Landscape';
  metaName: string;
}

// Create complete metadata for each template
export const templateMetadata: Record<TemplateId, TemplateMetadata> = {
  'standard': {
    id: 'standard',
    name: 'Versa Tag Standard',
    description: 'Standard Versa Tag with white background',
    width: '3in',
    height: '3in',
    orientation: 'Portrait',
    metaName: templateMetaNames.standard
  },
  'standard_yellow': {
    id: 'standard_yellow',
    name: 'Versa Tag Standard Yellow',
    description: 'Standard Versa Tag with yellow background',
    width: '3in',
    height: '3in',
    orientation: 'Portrait',
    metaName: templateMetaNames.standard_yellow
  },
  'gray': {
    id: 'gray',
    name: 'Versa Tag Gray',
    description: 'Gray Versa Tag for a professional look',
    width: '3in',
    height: '3in',
    orientation: 'Portrait',
    metaName: templateMetaNames.gray
  },
  'white': {
    id: 'white',
    name: 'Versa Tag White',
    description: 'White Versa Tag with clean design',
    width: '1.22in',
    height: '2.22in',
    orientation: 'Portrait',
    metaName: templateMetaNames.white
  },
  'white_custom': {
    id: 'white_custom',
    name: 'Versa Tag White Custom',
    description: 'Customized white Versa Tag with additional fields',
    width: '1.22in',
    height: '3in',
    orientation: 'Portrait',
    metaName: templateMetaNames.white_custom
  }
}; 