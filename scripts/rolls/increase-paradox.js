/* global ChatMessage, foundry, game */

// Esta função substitui _increaseHunger para atores do tipo 'mage'.
export async function _increaseParadox (actor, amount, rollMode) {
  // Clonando a lógica V5, mas usando a semântica Paradoxo
  const paradoxMax = actor.system.hunger.max // Assume que o prepareData do Mago define o limite
  const currentParadox = actor.system.hunger.value
  const newParadoxAmount = Math.min(currentParadox + amount, paradoxMax)

  // Se não for fornecido rollMode, use o padrão do usuário
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  // Se o ator já atingiu o limite de Paradoxo, avise.
  if (amount > 0 && currentParadox === paradoxMax) {
    // CLONE DA LÓGICA DE MENSAGEM V5, com strings de localização MTA.
    await foundry.applications.handlebars.renderTemplate('systems/vtm5e/display/ui/chat/chat-message-content.hbs', {
      name: game.i18n.localize('WOD5E.MTA.ParadoxFull1'), // Nova string
      img: 'modules/mage-sheet-module/assets/icons/dice/paradox-max.png', // Ícone customizado
      description: game.i18n.localize('WOD5E.MTA.ParadoxFull2') // Nova string
    }).then(html => {
      const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, rollMode)
      ChatMessage.create(message)
    })
  }

  // Atualiza o ator usando o caminho de dados V5
  actor.update({ 'system.hunger.value': newParadoxAmount })
}