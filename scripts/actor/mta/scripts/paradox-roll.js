/* global game, WOD5E */

// Importa o motor de rolagem do sistema
import { WOD5eDice } from '/systems/vtm5e/system/scripts/system-rolls.js' 
// Importa o script que verifica modificadores (situational-modifiers.js)
import { getActiveModifiers } from '/systems/vtm5e/system/scripts/rolls/situational-modifiers.js' 
// Importa suas funções de Arete (do seu módulo)
import { getAreteValues, areteToRouse } from './arete.js' 
// Importa a função de aumento de Paradoxo que você criou
import { _increaseParadox } from '../../../scripts/rolls/increase-paradox.js' 


/**
 * Lida com o "Teste de Paradoxo" (Clone do _onRouseCheck).
 * @param {object} actor - O Ator (Mago)
 * @param {object} item - O Item (Rotina de Esfera)
 * @param {string} rollMode - O modo de rolagem
 */
export const _onParadoxCheck = async function (actor, item, rollMode) {
  // Variáveis Secundárias (Clonando a estrutura V5)
  const level = item.system.level // Nível do Poder/Rotina
  const cost = item.system.cost > 0 ? item.system.cost : 1 // Custo da Rotina (Será o Paradoxo Base)
  const selectors = ['paradox-check'] // Novo seletor para Modificadores
  
  // Define o rollMode se não for definido
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  // Lógica de Mago: Se a Rotina é Vulgar ou Coincidente (Seus parâmetros customizados)
  // Nota: Estes parâmetros (isVulgar, isCoincident) precisam ser passados pela folha de ator.
  // Por agora, vamos usar a lógica base do custo.

  // 1. VERIFICAÇÃO DO TIPO DE ATOR (CLONE DE: if (actor.type === 'vampire'))
  if (actor.type === 'mage') {
    // A. Valores de Arete
    const aretePotency = actor.system.arete.potency // O nível de Arete (Substitui blood.potency)
    const areteRerolls = await areteToRouse(aretePotency, level) // Re-rolagem (Será false)

    // B. Obtém Modificadores Situacionais
    const activeModifiers = await getActiveModifiers({
      actor,
      selectors
    })

    // C. Define o Número de Dados de Paradoxo (Baseado no Custo/Nível/Vulgaridade)
    // Usamos o 'cost' como o número base de dados de Paradoxo (Substitui o advancedDice V5)
    const paradoxDice = cost + activeModifiers.totalValue

    // D. Envia a rolagem para o sistema (CLONE ESTRITO DO WOD5eDice.Roll)
    WOD5eDice.Roll({
      advancedDice: paradoxDice,
      title: `${game.i18n.localize('WOD5E.MTA.ParadoxCheck')} - ${item.name}`, // Strings Mago
      actor,
      disableBasicDice: true,
      rerollHunger: areteRerolls, // Será 'false'
      increaseHunger: true, // Flag Mago: Usamos esta flag para indicar "Teste de Risco"
      selectors,
      rollMode,
      quickRoll: true,

      // E. CALLBACK (Interceptar a Falha) - Para chamar _increaseParadox
      callback: (err, rollData) => {
        if (err) return console.log(err)

        // Se o dado de risco V5 falhou (rollData.increaseHunger é true)
        if (rollData.increaseHunger) {
          // Aumentamos o Paradoxo (chamando sua função customizada)
          _increaseParadox(actor, 1, rollMode) 
        }
      }
    })
  } 
  // CLONE DA LÓGICA GHOUL/OUTROS (Se houver regra para não-magos usarem Rotinas)
  // Aqui, você pode incluir a lógica de dano agravado (Ghoul) ou a lógica de Mundano.
  // ... else if (actor.type === 'mortal') { ... } 
}