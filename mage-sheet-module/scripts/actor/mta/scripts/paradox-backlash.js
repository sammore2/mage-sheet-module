/* global game, foundry, ChatMessage */

// Novamente, sem imports relativos. Usamos o 'game.wod5e.WOD5eDice'.

/**
 * Handle rolling for a Paradox Backlash (antigo Frenzy)
 */
export const _onParadoxBacklash = async function (event) {
  event.preventDefault()

  const actor = this.actor

  // Pergunta ao jogador se ele quer resistir
  const content = `<p>${game.i18n.localize('WOD5E.MTA.BacklashChoiceResist')}</p>` // (Adicione esta tradução)

  const doBacklashRoll = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize('WOD5E.MTA.ParadoxBacklash') // (Adicione esta tradução)
    },
    content,
    modal: true,
    buttons: [
      {
        label: game.i18n.localize('WOD5E.ItemsList.Resist'),
        action: 'resist'
      },
      {
        label: game.i18n.localize('WOD5E.MTA.GiveIn'), // (Adicione esta tradução)
        action: 'give-in'
      }
    ]
  })

  if (doBacklashRoll === 'resist') {
    // Pega os valores de Vontade e Sabedoria
    const willpower = actor.system.willpower.value
    const wisdom = actor.system.wisdom.value
    
    // Parada de dados: Vontade + (Sabedoria / 3, arredondado para baixo)
    const dicePool = willpower + Math.floor(wisdom / 3)

    game.wod5e.WOD5eDice.Roll({
      basicDice: dicePool,
      title: game.i18n.localize('WOD5E.MTA.ResistingBacklash'), // (Adicione esta tradução)
      selectors: ['willpower', 'wisdom'], // (seletores corretos)
      actor,
      data: actor.system,
      quickRoll: true,
      disableAdvancedDice: true,
      callback: (err, rollData) => {
        if (err) return console.log(err)

        const hasSuccess = rollData.terms[0].results.some(result => result.success)

        if (hasSuccess) {
          // Conseguiu resistir
          // (Podemos pular a mensagem de chat customizada)
        } else {
          // Falhou em resistir, entra em Backlash
          actor.update({ 'system.frenzyActive': true }) // (Usando o boolean que definimos no template.json)
        }
      }
    })
  } else if (doBacklashRoll === 'give-in') {
    // Entra em Backlash automaticamente
    actor.update({ 'system.frenzyActive': true })
  }
}