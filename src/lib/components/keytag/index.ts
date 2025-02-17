import Root from "./KeyTag.svelte";
import TemplateSelector from "./TemplateSelector.svelte";
import StandardLabel from "./templates/StandardLabel.svelte";
import VersaTagGray from "./templates/VersaTagGray.svelte";
import VersaTagStandard from "./templates/VersaTagStandard.svelte";
import VersaTagStandardYellow from "./templates/VersaTagStandardYellow.svelte";
import VersaTagWhite from "./templates/VersaTagWhite.svelte";
import VersaTagWhiteCustom from "./templates/VersaTagWhiteCustom.svelte";

// Template mapping
export const templates = {
  standard: StandardLabel,
  gray: VersaTagGray,
  standard_white: VersaTagStandard,
  standard_yellow: VersaTagStandardYellow,
  white: VersaTagWhite,
  white_custom: VersaTagWhiteCustom
};

export {
    Root,
    TemplateSelector,
    //
    Root as KeyTag,
    TemplateSelector as KeyTagTemplateSelector,
}; 