/* global foundry */

// Preparation functions (Clonando o caminho relativo)
// Estes scripts de preparacao (prepareXContext) devem ser clonados/adaptados no seu módulo
import { prepareDescriptionContext, prepareDicepoolContext, prepareMacroContext, prepareModifiersContext, prepareItemSettingsContext } from '../../scripts/actor/mta/scripts/prepare-partials.js'
// Importa a sua definição de Esferas (para o dropdown)
import { Spheres } from '../../api/def/spheres.js' // Sua nova definição de Esferas (WOD5E.Spheres)
// Base item sheet to extend from
import { MageItemSheetBase } from './mage-item-sheet-base.js' // Sua classe base que estende WoDItemBase
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Estende a ficha base do Item Mago.
 * Esta folha é usada para Esferas.
 * @extends {MageItemSheetBase}
 */
export class SphereItemSheet extends HandlebarsApplicationMixin(MageItemSheetBase) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  // 1. Definição das Partes (Partials Handlebars)
  static PARTS = {
    header: {
      template: 'modules/mage-sheet-module/template/items/mta/sphere-sheet.hbs' // Novo template de Ficha de Esfera
    },
    tabs: {
      template: 'modules/mage-sheet-module/template/items/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/items/parts/description.hbs'
    },
    dicepool: {
      template: 'systems/vtm5e/display/shared/items/parts/dicepool.hbs'
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

  // 2. Definição das Abas (Tabs)
  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    dicepool: {
      id: 'dicepool',
      group: 'primary',
      label: 'WOD5E.Tabs.Dicepool',
      hidden: this.document.parent?.type === 'spc'
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

  // 3. Preparação do Contexto Principal
  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext() // Herda contexto da MageItemSheetBase
    const item = this.item
    const itemData = item.system

    // ADAPTAÇÃO: Substitui disciplineOptions/selectedDiscipline por Esferas
    data.sphereOptions = Spheres.getList({}) // Usa a definição de Esferas
    data.selectedSphere = itemData.sphere // A chave de dado deve ser 'sphere'
    data.level = itemData.level
    data.cost = itemData.cost
    // data.disciplineOptions (V5) não existe mais.

    return data
  }

  // 4. Preparação do Contexto de Partials
  async _preparePartContext (partId, context, options) {
    // Herda a preparação da MageItemSheetBase
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const item = this.item

    // Clona o switch para carregar os contextos (description, dicepool, etc.)
    switch (partId) {
      // Stats
      case 'description':
        // prepareDescriptionContext (V5) e outros devem ser clonados/adaptados
        return prepareDescriptionContext(context, item) 
      case 'dicepool':
        return prepareDicepoolContext(context, item)
      case 'macro':
        return prepareMacroContext(context, item)
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }

  _configureRenderOptions (options) {
    super._configureRenderOptions(options)

    // Clonando a lógica V5 para esconder 'dicepool' em SPC, se aplicável.
    if (this.document.parent && this.document.parent?.type === 'spc') {
      options.parts = options.parts.filter(item => item !== 'dicepool')
    }
  }
}