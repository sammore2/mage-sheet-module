/* global Hooks */

// Base definition class
import { BaseDefinitionClass } from '/systems/vtm5e/system/api/def/base-definition-class.js'

// Importações das classes de Sheet (Você DEVE criá-las no seu módulo)
import { MageItemSheetBase } from "../../item/mta/mage-item-sheet-base.js"; 
import { SphereItemSheet } from "../../item/mta/sphere-item-sheet.js";
import { RoteItemSheet } from "../../item/mta/rote-item-sheet.js";
import { TraditionItemSheet } from "../../item/mta/tradition-item-sheet.js";
// Adicione as Sheets faltantes para Avatar, Focus, Magic Resonance

export class MageItemTypes extends BaseDefinitionClass {
  // Clonando o método estático do sistema base
  static onReady () {
    MageItemTypes.setSortAlphabetically()
    MageItemTypes.initializeLabels()
  }

  // ITENS MAGE (Clonando a estrutura V5: label, types, sheetClass, restrictedActorTypes, limitOnePerActor)

  static tradition = {
    label: 'TYPES.Item.tradition', 
    img: 'modules/mage-sheet-module/assets/icons/tradition.webp', 
    types: ['tradition'],
    sheetClass: TraditionItemSheet,
    restrictedActorTypes: ['mage'],
    limitOnePerActor: true
  }

  static sphere = {
    label: 'TYPES.Item.sphere', 
    img: 'modules/mage-sheet-module/assets/icons/sphere.webp',
    types: ['sphere'],
    sheetClass: SphereItemSheet,
    restrictedActorTypes: ['mage']
  }

  static rote = {
    label: 'TYPES.Item.rote', 
    img: 'modules/mage-sheet-module/assets/icons/rote.webp',
    types: ['rote'],
    sheetClass: RoteItemSheet,
    restrictedActorTypes: ['mage']
  }

  static avatar = {
    label: 'TYPES.Item.avatar',
    img: 'modules/mage-sheet-module/assets/icons/avatar.webp',
    types: ['avatar'],
    sheetClass: MageItemSheetBase, 
    restrictedActorTypes: ['mage'],
    limitOnePerActor: true
  }

  static focus = {
    label: 'TYPES.Item.focus',
    img: 'modules/mage-sheet-module/assets/icons/focus.webp',
    types: ['focus'],
    sheetClass: MageItemSheetBase,
    restrictedActorTypes: ['mage'],
    limitOnePerActor: false
  }
  
  static magic_resonance = {
    label: 'TYPES.Item.magic_resonance',
    img: 'modules/mage-sheet-module/assets/icons/resonance.webp',
    types: ['magic_resonance'],
    sheetClass: MageItemSheetBase,
    restrictedActorTypes: ['mage'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }
}

Hooks.once('ready', MageItemTypes.onReady)