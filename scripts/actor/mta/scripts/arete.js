/* global game */

// Este arquivo define os valores passivos ganhos por nível de Arete.
//
// Os valores que eu imaginei (você pode mudar):
// - maxSphere: O nível máximo de Esfera que o Mago pode aprender.
// - paradoxDice: Quantos dados de Paradoxo são rolados ao "forçar" uma magia (o seu "Rouse Check").
// - paradoxLimit: O máximo de Paradoxo que o Mago pode acumular antes de um Backlash.
// - quintessencePool: O máximo de Quintessência que o Mago pode armazenar.
// - roteBonus: Um bônus (em dados) ao executar Roteiros (Magias pré-definidas).

/**
 * Retorna um objeto com os valores passivos de Arete para um determinado nível.
 * @param {number} level - O nível de Arete (0-10)
 */
export const getAreteValues = async function (level) {
  const ARETE_VALUES = [
    // Nível 0 (Adormecido)
    {
      maxSphere: 0,
      paradoxDice: 0,
      paradoxLimit: 0,
      quintessencePool: 0,
      roteBonus: 0
    },
    // Nível 1 (Iniciado)
    {
      maxSphere: 1,
      paradoxDice: 1,
      paradoxLimit: 5,
      quintessencePool: 10,
      roteBonus: 0
    },
    // Nível 2
    {
      maxSphere: 2,
      paradoxDice: 1,
      paradoxLimit: 6,
      quintessencePool: 11,
      roteBonus: 1
    },
    // Nível 3
    {
      maxSphere: 3,
      paradoxDice: 2,
      paradoxLimit: 7,
      quintessencePool: 12,
      roteBonus: 1
    },
    // Nível 4
    {
      maxSphere: 3,
      paradoxDice: 2,
      paradoxLimit: 8,
      quintessencePool: 13,
      roteBonus: 2
    },
    // Nível 5
    {
      maxSphere: 4,
      paradoxDice: 3,
      paradoxLimit: 9,
      quintessencePool: 14,
      roteBonus: 2
    },
    // Nível 6
    {
      maxSphere: 5,
      paradoxDice: 3,
      paradoxLimit: 10,
      quintessencePool: 15,
      roteBonus: 3
    },
    // Nível 7
    {
      maxSphere: 5,
      paradoxDice: 4,
      paradoxLimit: 11,
      quintessencePool: 16,
      roteBonus: 3
    },
    // Nível 8
    {
      maxSphere: 5,
      paradoxDice: 4,
      paradoxLimit: 12,
      quintessencePool: 17,
      roteBonus: 4
    },
    // Nível 9
    {
      maxSphere: 5,
      paradoxDice: 5,
      paradoxLimit: 13,
      quintessencePool: 18,
      roteBonus: 4
    },
    // Nível 10 (Arqui-Mago)
    {
      maxSphere: 5, // Ou 6, se você permitir
      paradoxDice: 5,
      paradoxLimit: 15,
      quintessencePool: 20,
      roteBonus: 5
    }
  ]

  // Garante que o nível esteja dentro dos limites (0-10)
  const safeLevel = Math.max(0, Math.min(level, 10));
  return ARETE_VALUES[safeLevel];
}

/**
 * Retorna os textos de tooltip para a ficha de Mago.
 * (Função renomeada de 'getBloodPotencyText' para 'getAreteText')
 * @param {number} level - O nível de Arete (0-10)
 */
export const getAreteText = async function (level) {
  // Pega os valores numéricos da função acima
  const values = await getAreteValues(level);

  // Mapeia os valores para chaves de tradução (que você pode adicionar em lang/pt-BR.json)
  // (Ex: "WOD5E.MTA.MaxSphere", "WOD5E.MTA.ParadoxDice", etc.)
  const ARETE_TEXT = [
    // Nível 0
    {
      maxSphere: `${game.i18n.localize('WOD5E.MTA.MaxSphere')}: ${values.maxSphere}`,
      paradoxDice: `${game.i18n.localize('WOD5E.MTA.ParadoxDice')}: ${values.paradoxDice}`,
      paradoxLimit: `${game.i18n.localize('WOD5E.MTA.ParadoxLimit')}: ${values.paradoxLimit}`,
      quintessencePool: `${game.i18n.localize('WOD5E.MTA.QuintessencePool')}: ${values.quintessencePool}`,
      roteBonus: `${game.i18n.localize('WOD5E.MTA.RoteBonus')}: ${values.roteBonus}`
    },
    // Nível 1
    {
      maxSphere: `${game.i18n.localize('WOD5E.MTA.MaxSphere')}: ${values.maxSphere}`,
      paradoxDice: `${game.i18n.localize('WOD5E.MTA.ParadoxDice')}: ${values.paradoxDice}`,
      paradoxLimit: `${game.i18n.localize('WOD5E.MTA.ParadoxLimit')}: ${values.paradoxLimit}`,
      quintessencePool: `${game.i18n.localize('WOD5E.MTA.QuintessencePool')}: ${values.quintessencePool}`,
      roteBonus: `${game.i18n.localize('WOD5E.MTA.RoteBonus')}: ${values.roteBonus}`
    }
    // ... (Você pode copiar e colar as entradas de Nível 1 para os níveis 2-10)
    // ... (Nível 2)
    // ... (Nível 3)
    // ... (Nível 4)
    // ... (Nível 5)
    // ... (Nível 6)
    // ... (Nível 7)
    // ... (Nível 8)
    // ... (Nível 9)
    // ... (Nível 10)
  ]

  // Para economizar espaço, vamos apenas re-usar o Nível 1 como template
  // (No código final, você deve criar uma entrada para cada nível, 0-10)
  const safeLevel = Math.max(0, Math.min(level, 10));
  
  // Se não houver texto definido para o nível, usa o Nível 0
  return ARETE_TEXT[safeLevel] || ARETE_TEXT[0]; 
}


/**
 * Define se o Mago pode re-rolar dados de Paradoxo (o "Rouse" de V5).
 * (Função renomeada de 'areteToRouse' para 'getParadoxReroll')
 *
 * @param {number} areteLevel - O nível de Arete do Mago
 * @param {number} sphereLevel - O nível da Esfera sendo usada
 */
export const getParadoxReroll = async function (areteLevel, sphereLevel) {
  // A lógica original de V5 era:
  // "Você pode re-rolar dados de FOME em poderes de nível X ou inferior"
  
  // A mecânica de Mago (Paradoxo) é um *risco*, não um benefício.
  // Então, re-rolar dados de Paradoxo não faz sentido.
  
  // Minha sugestão (mais simples):
  // Vamos desabilitar a re-rolagem de Paradoxo.
  // O seu script 'rouse.js' (que vamos refatorar) vai *sempre* rolar os dados de Paradoxo, 
  // sem re-rolagens, o que é mais temático.
  return false
}