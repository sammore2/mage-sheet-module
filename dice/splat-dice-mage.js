/* global foundry */

// Importa os caminhos e faces dos dados (MTA specific icons)
import { mageDiceLocation, roteDiceFaces, paradoxDiceFaces } from './mage-icons.js'

// ==================================================================================
// CLONE ESTRUTURAL DE WOD5eDie (Corrigido para autossuficiência)
// ==================================================================================
class WOD5eDie extends foundry.dice.terms.Die {
  constructor (termData) {
    termData.faces = 10
    if (termData?.modifiers && termData?.modifiers.indexOf('cs>5') === -1) {
      termData.modifiers.push('cs>5')
    }
    if (!termData?.modifiers) {
      termData.modifiers = ['cs>5']
    }
    super(termData)
  }

  get gameSystem () {
    return this.constructor.GAME_SYSTEM
  }

  get dieType () {
    return this.constructor.DIE_TYPE
  }
}


/**
 * Estende o Die base para o Dado de Rotina (R) - Dado de Sucesso
 * @extends {WOD5eDie}
 */
export class MageRoteDie extends WOD5eDie {
  static GAME_SYSTEM = 'mage'
  static DIE_TYPE = 'rote'
  /** @override */
  static DENOMINATION = 'r' 

  /** @override */
  static getResultLabel (result) {
    // Usa o roteDiceLocation
    return {
      1: `<img src="${roteDiceLocation + roteDiceFaces.failure}" />`,
      2: `<img src="${roteDiceLocation + roteDiceFaces.failure}" />`,
      3: `<img src="${roteDiceLocation + roteDiceFaces.failure}" />`,
      4: `<img src="${roteDiceLocation + roteDiceFaces.failure}" />`,
      5: `<img src="${roteDiceLocation + roteDiceFaces.failure}" />`,
      6: `<img src="${roteDiceLocation + roteDiceFaces.success}" />`,
      7: `<img src="${roteDiceLocation + roteDiceFaces.success}" />`,
      8: `<img src="${roteDiceLocation + roteDiceFaces.success}" />`,
      9: `<img src="${roteDiceLocation + roteDiceFaces.success}" />`,
      10: `<img src="${roteDiceLocation + roteDiceFaces.critical}" />`
    }[result]
  }
}

/**
 * Estende o Die base para o Dado de Paradoxo (P) - Dado de Risco
 * @extends {WOD5eDie}
 */
export class MageParadoxDie extends WOD5eDie {
  static GAME_SYSTEM = 'mage'
  static DIE_TYPE = 'paradox'
  /** @override */
  static DENOMINATION = 'p'

  /** @override */
  static getResultLabel (result) {
    // Usa o paradoxDiceLocation
    return {
      1: `<img src="${paradoxDiceLocation + paradoxDiceFaces.compulsion}" />`, 
      2: `<img src="${paradoxDiceLocation + paradoxDiceFaces.failure}" />`,
      3: `<img src="${paradoxDiceLocation + paradoxDiceFaces.failure}" />`,
      4: `<img src="${paradoxDiceLocation + paradoxDiceFaces.failure}" />`,
      5: `<img src="${paradoxDiceLocation + paradoxDiceFaces.failure}" />`,
      6: `<img src="${paradoxDiceLocation + paradoxDiceFaces.success}" />`,
      7: `<img src="${paradoxDiceLocation + paradoxDiceFaces.success}" />`,
      8: `<img src="${paradoxDiceLocation + paradoxDiceFaces.success}" />`,
      9: `<img src="${paradoxDiceLocation + paradoxDiceFaces.success}" />`,
      10: `<img src="${paradoxDiceLocation + paradoxDiceFaces.critical}" />` 
    }[result]
  }
}