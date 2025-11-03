/* global game, foundry, ChatMessage */

// Importa o motor de rolagem do sistema
import { WOD5eDice } from '/systems/vtm5e/system/scripts/system-rolls.js' 

/**
 * Lida com o Teste de Sabedoria (Clone do _onRemorseRoll)
 * Se falhar, o Mago entra em Silêncio Permanente (frenzyActive V5)
 * @param {object} event - O evento de clique (mantido do template V5)
 */
export const _onWisdomRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor // Assumimos que a ficha passa 'this.actor'

  // Secondary variables (Substituindo Humanity por Wisdom)
  const wisdom = actor.system.humanity.value // O valor de Sabedoria (usando o campo V5 'humanity')
  const stain = actor.system.humanity.stains // O valor das Máculas (usando o campo V5 'stains')
  // Cálculo do Dice Pool (CLONE ESTRITO do V5)
  const dicePool = Math.max((10 - wisdom - stain), 1)

  // Envia a rolagem para o sistema (CLONE ESTRITO do V5)
  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.MTA.RollingWisdom'), // String Mago
    selectors: ['wisdom'], // Novo seletor para modificadores
    actor,
    data: actor.system,
    quickRoll: true,
    disableAdvancedDice: true,
    
    // CALLBACK (CLONE ESTRITO do V5, mas com lógica Mago)
    callback: async (err, rollData) => {
      if (err) console.log('Mage: The Ascension 5e | ' + err)

      const hasSuccess = rollData.terms[0].results.some(result => result.success)

      // Se houver sucesso, as Máculas são zeradas (Mago zera as Stains)
      if (hasSuccess) {
        await actor.update({ 'system.humanity.stains': 0 })
      } else {
        // LÓGICA DE SILÊNCIO PERMANENTE (Substitui a redução de Humanidade)
        await actor.update({
          // Zera as Máculas, mas ativa o Silêncio Permanente (Assumindo que frenzyActive é o campo de Status V5)
          'system.humanity.stains': 0,
          'system.frenzyActive': true // Usando a chave V5 'frenzyActive' para o Silêncio
        })

        // Notificação de Falha de Sabedoria (CLONE ESTRITO V5)
        await foundry.applications.handlebars.renderTemplate('systems/vtm5e/display/ui/chat/chat-message-content.hbs', {
          name: game.i18n.localize('WOD5E.MTA.WisdomFailed'), // Nova string
          img: 'systems/vtm5e/assets/icons/dice/vampire/bestial-failure.png',
          description: game.i18n.localize('WOD5E.MTA.WisdomFailedDescription') // Nova string
        }).then(html => {
          const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, rollMode)
          ChatMessage.create(message)
        })
      }
    }
  })
}