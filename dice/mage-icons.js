/* global WOD5E */

// Clonando o padrão V5, mas apontando para a pasta do seu módulo
const mageDiceLocation = '../assets/icons/dice/mage/'

// =========================================================================
// DEFINIÇÕES DE FACES DE DADOS MAGE (Baseadas no padrão V5)
// =========================================================================

// Dados de Rotina (Clonando o padrão de Sucesso/Crítico normal)
const roteDiceFaces = {
  success: 'rote-success.png',
  failure: 'rote-failure.png',
  critical: 'rote-critical.png'
}

// Dados de Paradoxo (Clonando o padrão de Risco: Falha Crítica em 1)
const paradoxDiceFaces = {
  // Chamamos de 'compulsion' (Compulsão) para refletir a Falha Bestial/Brutal do Mago
  compulsion: 'paradox-compulsion.png', 
  success: 'paradox-success.png',
  failure: 'paradox-failure.png',
  critical: 'paradox-critical.png'
}

// Exportar TUDO que o splat-dice-mage.js e outros scripts de dado precisam
export { mageDiceLocation, roteDiceFaces, paradoxDiceFaces }