/* global foundry */

// Preparation functions - Assumindo que você criará este arquivo
import { prepareDescriptionContext, prepareMacroContext, prepareModifiersContext, prepareItemSettingsContext } from '../../../scripts/actor/mta/scripts/prepare-partials.js'
// Base item sheet a estender
import { WoDItem } from '/systems/vtm5e/system/item/wod-item-base.js/wod-item-base.js' // Assumindo importação do sistema base
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Estende o WoDItem document (Base para todos os itens MTA)
 * @extends {WoDItem}
 */
export class MageItemSheetBase extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  // Definições de Partes (Templates Handlebars)
  static PARTS = {
    header: {
      template: 'modules/mage-sheet-module/template/items/mta/mage-item-sheet-base.hbs'
    },
    tabs: {
      template: 'modules/mage-sheet-module/template/items/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/items/parts/description.hbs'
    },
    macro: {
      template: 'systems/vtm5e/display/shared/items/parts/macro.hbs'
    },
    modifiers: {
      template: 'systems/vtm5e/display/shared/items/parts/modifiers.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/items/parts/item-settings.hbs'
    }
  }

  // Definições de Abas
  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    macro: {
      id: 'macro',
      group: 'primary',
      label: 'WOD5E.ItemsList.Macro'
    },
    modifiers: {
      id: 'modifiers',
      group: 'primary',
      label: 'WOD5E.ItemsList.Modifiers'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      label: 'WOD5E.ItemsList.ItemSettings'
    }
  }

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()
    // data.item = this.item
    return data
  }
}