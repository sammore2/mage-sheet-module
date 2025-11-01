/* global game */

// Importa o "motor" do sistema de rolagens do WOD5e
import { WOD5eDice } from '/systems/vtm5e/system/scripts/system-rolls.js' // <- Cuidado com este caminho
// Importa o "motor" de Arete que NÓS criamos
import { getAreteValues, getParadoxReroll } from './arete.js' 

/**
 * Lida com o "Teste de Paradoxo" (antigo Rouse Check) quando um poder de Esfera é usado.
 * @param {object} actor - O Ator (Mago)
 * @param {object} item - O Item (Poder de Esfera)
 * @param {string} rollMode - O modo de rolagem (public, private, etc.)
 */
export const _onParadoxCheck = async function (actor, item, rollMode) {
  // Pega o nível de Arete do ator
  const areteLevel = actor.system.arete.potency
  // Pega os valores passivos de Arete (do nosso 'arete.js')
  const areteValues = await getAreteValues(areteLevel)

  // Pega o Nível da Esfera que está sendo usada
  const sphereLevel = item.system.level

  // Define quantos dados de Paradoxo rolar.
  // Pela nossa tabela em 'arete.js', isso é 'paradoxDice'
  const paradoxDice = areteValues.paradoxDice

  // Se a magia não custa Paradoxo (nível 0 de Arete?), não rola.
  if (paradoxDice === 0) return

  // Pega o Nível do poder sendo usado
  const powerLevel = item.system.level
  // Pega a lógica de re-rolagem (que em 'arete.js' nós definimos como 'false')
  const paradoxRerolls = await getParadoxReroll(areteLevel, powerLevel)

  // Define o modo de rolagem
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  // Envia a rolagem para o sistema
  game.wod5e.WOD5eDice.Roll({ // <- Usando a forma segura (global)
    advancedDice: paradoxDice, // Rola X dados de Paradoxo
    title: `${game.i18n.localize('WOD5E.MTA.ParadoxCheck')} - ${item.name}`,
    actor,
    disableBasicDice: true, // Não usamos dados normais
    rerollHunger: paradoxRerolls, // (Está 'false', como definimos)
    
    // ATENÇÃO: Esta é a mecânica central
    // 'increaseHunger' no V5 significa "Se falhar (1-5), ganha Fome"
    // Nós vamos re-mapear isso para "Se falhar (1-5), ganha Paradoxo"
    increaseHunger: true, 
    
    rollMode,
    quickRoll: true,

    // --- INÍCIO DA CORREÇÃO ---
    // (A correção que você pediu)
    callback: (err, rollData) => {
      if (err) return console.log(err)

      // 'rollData.increaseHunger' é um boolean (true/false) que o sistema
      // WOD5e define se a rolagem de "fome" (paradoxo) falhou (resultado 1-5).
      if (rollData.increaseHunger) {
        // Se falhou, aumentamos o Paradoxo manualmente.
        const currentParadox = actor.system.paradox.value
        const maxParadox = actor.system.paradox.max
        
        // Adiciona 1 de Paradoxo, até o máximo (definido no template.json)
        const newParadox = Math.min(currentParadox + 1, maxParadox)

        // Atualiza o ator com o novo valor de Paradoxo
        actor.update({ 'system.paradox.value': newParadox })
      }
    }
    // --- FIM DA CORREÇÃO ---
  })
}