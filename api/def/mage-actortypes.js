/* global Hooks */

// Assumindo que BaseDefinitionClass pode ser importado do sistema base
import { BaseDefinitionClass } from '/systems/wod5e/module/api/def/base-definition-class.js' 
// Importação da Sheet (para registro no Foundry)
import { MageActorSheet } from "../../actor/mta/mage-actor-sheet.js"; 

export class MageActorTypes extends BaseDefinitionClass {
  // Clonando o método estático do sistema base
  static onReady () {
    MageActorTypes.setSortAlphabetically()
    MageActorTypes.initializeLabels()
  }

  static mage = {
    // CORREÇÃO: Usar a chave de tradução correta para aparecer no menu
    label: 'TYPES.Actor.mage', 
    types: ['mage'],
    sheetClass: MageActorSheet // Sua Sheet customizada
  }
}

// Clonando o Hook para inicializar as labels, como no sistema base
Hooks.once('ready', MageActorTypes.onReady)