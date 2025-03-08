import KeyTag from './KeyTag.svelte';
import TemplateSelector from './TemplateSelector.svelte';
import PrintInstructions from './PrintInstructions.svelte';
import type { ComponentType } from 'svelte';

// Import all templates
import VersaTagStandardYellow from './templates/VersaTagStandardYellow.svelte';
import VersaTagStandardGray from './templates/VersaTagStandardGray.svelte';
import VersaTagStandard from './templates/VersaTagStandard.svelte';
import VersaTagStandardWhite from './templates/VersaTagStandardWhite.svelte';
import VersaTagCustomWhite from './templates/VersaTagCustomWhite.svelte';

// Import metadata
import { templateMetadata, templateMetaNames } from './templateMeta';
import type { TemplateId } from './types';

// Map template IDs to components
export const templates: Record<TemplateId, ComponentType> = {
  standard: VersaTagStandard,
  standard_yellow: VersaTagStandardYellow,
  gray: VersaTagStandardGray,
  white: VersaTagStandardWhite,
  white_custom: VersaTagCustomWhite
};

// Export components
export {
  KeyTag,
  TemplateSelector,
  PrintInstructions,
  templateMetadata,
  templateMetaNames
}; 