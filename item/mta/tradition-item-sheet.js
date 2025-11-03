/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareModifiersContext, prepareItemSettingsContext } from '../scripts/prepare-partials-mta.js'
import { prepareBaneContext } from '../scripts/prepare-partials-mta.js' // Usado pelo ClanItemSheet
// Base item sheet a estender
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Estende o WoDItem document para a Ficha de Tradição (Clone de Clan)
 * @extends {WoDItem}
 */
export class TraditionItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'modules/mage-sheet-module/template/items/mta/tradition-sheet.hbs'
    },
    tabs: {
      template: 'modules/mage-sheet-module/template/items/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/items/parts/description.hbs'
    },
    bane: {
      template: 'systems/vtm5e/display/vtm/items/parts/bane.hbs' // Reutiliza o template de Bane V5
    },
    modifiers: {
      template: 'systems/vtm5e/display/shared/items/parts/modifiers.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/items/parts/item-settings.hbs'
    }
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    bane: {
      id: 'bane',
      group: 'primary',
      label: 'WOD5E.MTA.TraditionBane' // Nova Label
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
  
  // O prepareContext e _preparePartContext são clonados do V5 e adaptados
  async _preparePartContext (partId, context, options) {
    context = { ...(await super._preparePartContext(partId, context, options)) }
    const item = this.item

    switch (partId) {
      case 'description':
        return prepareDescriptionContext(context, item)
      case 'bane':
        return prepareBaneContext(context, item) // Chama o seu script MTA de Bane
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }
}