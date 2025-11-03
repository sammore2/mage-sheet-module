/* global game, foundry, ChatMessage, WOD5E */

// Importa o motor de rolagem do sistema e modificadores (Clone do V5)
import { getActiveModifiers } from '/systems/vtm5e/system/scripts/rolls/situational-modifiers.js'
import { WOD5eDice } from '/systems/vtm5e/system/scripts/system-rolls.js' 

/**
 * Lida com o Rebote de Paradoxo/Silêncio (Clone de _onFrenzyRoll).
 * É chamado quando actor.system.frenzyActive é ativado (após falha de Sabedoria).
 * @param {object} event - O evento de clique (passado pelo botão na ficha)
 */
export const _onParadoxBacklash = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Define o conteúdo do Diálogo (Pergunta se resiste ou cede ao Silêncio)
  const content = `<p>
    ${game.i18n.localize('WOD5E.MTA.BacklashChoiceResist')}
  </p>`

  // 1. Janela de Diálogo (CLONE ESTRITO V5)
  const doResistRoll = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize('WOD5E.MTA.ResistingBacklash')
    },
    content,
    modal: true,
    buttons: [
      {
        label: game.i18n.localize('WOD5E.VTM.Resist'), // Reutiliza Resist do V5
        action: 'resist'
      },
      {
        label: game.i18n.localize('WOD5E.MTA.GiveIn'), // Usa a nova string de Mago
        action: 'give-in'
      }
    ]
  })

  // 2. Lógica de Resistência
  if (doResistRoll === 'resist') {
    const selectors = ['paradox-backlash'] // Novo seletor

    // Obtém Modificadores Situacionais (CLONE ESTRITO V5)
    const activeModifiers = await getActiveModifiers({
      actor,
      selectors
    })

    // Rolagem: Força de Vontade (Willpower) vs. Dificuldade (Assumimos 3, clone de V5)
    const willpower = actor.system.willpower.value
    const basicDice = willpower + activeModifiers.totalValue
    const difficulty = 3 // Exemplo. A dificuldade real deve ser definida pelas regras.

    // Envia a rolagem (CLONE ESTRITO V5)
    WOD5eDice.Roll({
      basicDice,
      title: game.i18n.localize('WOD5E.MTA.ResistingBacklash'),
      actor,
      disableAdvancedDice: true,
      selectors,
      quickRoll: true,
      difficulty,

      // CALLBACK (Avalia o sucesso/falha do Teste de Vontade)
      callback: async (err, rollData) => {
        if (err) return console.log(err)

        const hasSuccess = rollData.successes >= difficulty

        if (hasSuccess) {
          // SUCESSO: Remove o Silêncio Permanente (frenzyActive)
          await actor.update({ 'system.frenzyActive': false })

          // Notificação de Sucesso (CLONE ESTRITO V5)
          await foundry.applications.handlebars.renderTemplate('systems/vtm5e/display/ui/chat/chat-message-content.hbs', {
            name: game.i18n.localize('WOD5E.MTA.BacklashResistSuccess'), // Nova string
            img: 'systems/vtm5e/assets/icons/dice/vampire/success.png',
            description: game.i18n.format('WOD5E.MTA.BacklashResistSuccessDescription', {
              actor: actor.name
            })
          }).then(html => {
            ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html })
          })
        } else {
          // FALHA: Mantém o Silêncio Permanente ativo
          await actor.update({ 'system.frenzyActive': true })

          // Notificação de Falha (CLONE ESTRITO V5)
          await foundry.applications.handlebars.renderTemplate('systems/vtm5e/display/ui/chat/chat-message-content.hbs', {
            name: game.i18n.localize('WOD5E.MTA.BacklashResistFailed'), // Nova string
            img: 'systems/vtm5e/assets/icons/dice/vampire/bestial-failure.png',
            description: game.i18n.format('WOD5E.MTA.BacklashResistFailedDescription', {
              actor: actor.name
            })
          }).then(html => {
            ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html })
          })
        }
      }
    })
  } else if (doResistRoll === 'give-in') {
    // 3. Lógica de Ceder (Silêncio Permanente Imediato)
    await actor.update({ 'system.frenzyActive': true })

    // Notificação de Rendição (CLONE ESTRITO V5)
    await foundry.applications.handlebars.renderTemplate('systems/vtm5e/display/ui/chat/chat-message-content.hbs', {
      name: game.i18n.localize('WOD5E.MTA.GiveInTitle'), // Nova string
      img: 'systems/vtm5e/assets/icons/dice/vampire/bestial-failure.png',
      description: game.i18n.format('WOD5E.MTA.GiveInDescription', {
        actor: actor.name
      })
    }).then(html => {
      ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html })
    })
  }
}