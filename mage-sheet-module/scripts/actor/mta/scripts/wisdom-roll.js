/* global game, foundry, ChatMessage */

// Nota: Removemos o 'import { WOD5eDice } from ...'
// Vamos usar a função global 'game.wod5e.WOD5eDice' para evitar erros 404.

/**
 * Handle rolling a Wisdom check (antigo Remorse)
 */
export const _onWisdomRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Pega os dados de Sabedoria (do template.json)
  const wisdom = actor.system.wisdom.value
  const stains = actor.system.wisdom.stains
  
  // A parada de dados é (10 - Sabedoria - Máculas), no mínimo 1
  const dicePool = Math.max((10 - wisdom - stains), 1)

  // Rola os dados
  game.wod5e.WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.MTA.RollingWisdom'), // (Adicione esta tradução)
    selectors: ['wisdom'], // (Usando o seletor de Sabedoria)
    actor,
    data: actor.system,
    quickRoll: true,
    disableAdvancedDice: true,
    callback: async (err, rollData) => {
      if (err) console.log('Mage Sheet Module | ' + err)

      const hasSuccess = rollData.terms[0].results.some(result => result.success)

      // Se tiver sucesso, limpa as Máculas
      if (hasSuccess) {
        await actor.update({ 'system.wisdom.stains': 0 })
      } else {
        // Se falhar, perde 1 de Sabedoria e limpa as Máculas
        await actor.update({
          'system.wisdom.value': Math.max(wisdom - 1, 0),
          'system.wisdom.stains': 0
        })

        // (Opcional: Envia uma mensagem de falha no chat.
        // O chat da rolagem já vai mostrar a falha, então podemos pular isso
        // para evitar depender de templates .hbs do vtm5e)
      }
    }
  })
}