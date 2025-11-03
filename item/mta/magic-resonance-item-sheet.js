/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareModifiersContext, prepareItemSettingsContext } from '../../../scripts/actor/mta/scripts/prepare-partials.js'
// Base item sheet a estender
import { WoDItem } from '/systems/vtm5e/system/item/wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Estende o WoDItem document para a Ficha de Ressonância Mágica (Clone de Resonance)
 * @extends {WoDItem}
 */
export class MagicResonanceItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }
  
  // Clonando as Partes do ResonanceItemSheet
  static PARTS = {
    header: { template: 'modules/mage-sheet-module/template/items/mta/magic-resonance-sheet.hbs' },
    tabs: { template: 'modules/mage-sheet-module/template/items/generic/tab-navigation.hbs' },
    description: { template: 'systems/vtm5e/display/shared/items/parts/description.hbs' },
    modifiers: { template: 'systems/vtm5e/display/shared/items/parts/modifiers.hbs' },
    settings: { template: 'systems/vtm5e/display/shared/items/parts/item-settings.hbs' }
  }

  // Clonando as Tabs do ResonanceItemSheet
  tabs = {
    description: { id: 'description', group: 'primary', label: 'WOD5E.Tabs.Description' },
    modifiers: { id: 'modifiers', group: 'primary', label: 'WOD5E.ItemsList.Modifiers' },
    settings: { id: 'settings', group: 'primary', label: 'WOD5E.ItemsList.ItemSettings' }
  }
  
  // Métodos de preparação clonados...
}