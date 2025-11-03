/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareDicepoolContext, prepareMacroContext, prepareModifiersContext, prepareItemSettingsContext } from '../scripts/prepare-partials-mta.js'
// Base item sheet a estender
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Estende o WoDItem document para a Ficha de Rotina (Clone simplificado de Discipline)
 * @extends {WoDItem}
 */
export class RoteItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  // Partes e Tabs clonadas do Sphere/Discipline

  static PARTS = {
    header: { template: 'modules/mage-sheet-module/template/items/mta/rote-sheet.hbs' },
    tabs: { template: 'modules/mage-sheet-module/template/items/generic/tab-navigation.hbs' },
    description: { template: 'systems/vtm5e/display/shared/items/parts/description.hbs' },
    dicepool: { template: 'systems/vtm5e/display/shared/items/parts/dicepool.hbs' },
    macro: { template: 'systems/vtm5e/display/shared/items/parts/macro.hbs' },
    modifiers: { template: 'systems/vtm5e/display/shared/items/parts/modifiers.hbs' },
    settings: { template: 'systems/vtm5e/display/shared/items/parts/item-settings.hbs' }
  }

  tabs = {
    description: { id: 'description', group: 'primary', label: 'WOD5E.Tabs.Description' },
    dicepool: { id: 'dicepool', group: 'primary', label: 'WOD5E.Tabs.Dicepool' },
    macro: { id: 'macro', group: 'primary', label: 'WOD5E.ItemsList.Macro' },
    modifiers: { id: 'modifiers', group: 'primary', label: 'WOD5E.ItemsList.Modifiers' },
    settings: { id: 'settings', group: 'primary', label: 'WOD5E.ItemsList.ItemSettings' }
  }
  
  // O prepareContext e _preparePartContext seriam clonados do V5 e adaptados.
}