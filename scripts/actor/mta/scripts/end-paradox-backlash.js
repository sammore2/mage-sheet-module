/**
 * Handle removing the backlash condition (antigo frenzy)
 */
export const _onEndParadoxBacklash = async function (event) {
  event.preventDefault()

  const actor = this.actor

  // 'frenzyActive' é o boolean que estamos usando para 'Backlash Ativo'
  await actor.update({ 'system.frenzyActive': false })
}