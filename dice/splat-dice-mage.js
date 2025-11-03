/* global foundry */

// Importa os caminhos e faces dos dados (Você deve criar este arquivo)
import { mageDiceLocation, roteDiceFaces, paradoxDiceFaces } from './icons-mage.js'
// Usaremos a classe base do sistema para herança
import { WOD5eDie } from '/systems/wod5e/module/dice/splat-dice.js' 

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
    // CLONE DA LÓGICA DE DADOS (Exemplo: Dado de Sucesso V5)
    return {
      1: `<img src="${mageDiceLocation + roteDiceFaces.failure}" />`,
      2: `<img src="${mageDiceLocation + roteDiceFaces.failure}" />`,
      3: `<img src="${mageDiceLocation + roteDiceFaces.failure}" />`,
      4: `<img src="${mageDiceLocation + roteDiceFaces.failure}" />`,
      5: `<img src="${mageDiceLocation + roteDiceFaces.failure}" />`,
      6: `<img src="${mageDiceLocation + roteDiceFaces.success}" />`,
      7: `<img src="${mageDiceLocation + roteDiceFaces.success}" />`,
      8: `<img src="${mageDiceLocation + roteDiceFaces.success}" />`,
      9: `<img src="${mageDiceLocation + roteDiceFaces.success}" />`,
      10: `<img src="${mageDiceLocation + roteDiceFaces.critical}" />`
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
    // CLONE DA LÓGICA DE DADOS DE RISCO (Exemplo: Dado de Fome V5)
    return {
      1: `<img src="${mageDiceLocation + paradoxDiceFaces.compulsion}" />`, // Novo: Compulsão (Falha Crítica)
      2: `<img src="${mageDiceLocation + paradoxDiceFaces.failure}" />`,
      3: `<img src="${mageDiceLocation + paradoxDiceFaces.failure}" />`,
      4: `<img src="${mageDiceLocation + paradoxDiceFaces.failure}" />`,
      5: `<img src="${mageDiceLocation + paradoxDiceFaces.failure}" />`,
      6: `<img src="${mageDiceLocation + paradoxDiceFaces.success}" />`,
      7: `<img src="${mageDiceLocation + paradoxDiceFaces.success}" />`,
      8: `<img src="${mageDiceLocation + paradoxDiceFaces.success}" />`,
      9: `<img src="${mageDiceLocation + paradoxDiceFaces.success}" />`,
      10: `<img src="${mageDiceLocation + paradoxDiceFaces.critical}" />`
    }[result]
  }
}