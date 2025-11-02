/**
 * MageRollDialog
 * Uma classe customizada que estende o RollDialog base do vtm5e.
 * Ela é responsável por abrir a janela de rolagem de Mago (Arete + Paradoxo).
 */
class MageRollDialog extends game.vtm5e.RollDialog {
  /**
   * @override
   * Define o template HTML que esta janela de diálogo usará.
   */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: 'modules/mage-sheet-module/templates/ui/mage-roll-dialog.hbs' // Nosso novo template HBS
    })
  }

  /**
   * @override
   * Prepara os dados para o template HBS.
   * Aqui, trocamos "hunger" por "paradox".
   */
  async getData () {
    const data = await super.getData()

    // Pega o valor de Paradoxo do ator
    data.hungerValue = this.actor.system.paradox.value
    // Define o rótulo para "Paradoxo"
    data.hungerLabel = game.i18n.localize('MTA.Paradox')
    // Define o ícone (podemos customizar isso depois)
    data.hungerDiceIcon = 'assets/icons/dialog/hunger-dice.png' // Reutilizando o ícone por enquanto

    return data
  }

  /**
   * @override
   * Função chamada quando o diálogo é enviado (botão "Rolar" é clicado).
   */
  _onRoll (event) {
    event.preventDefault()
    const form = event.currentTarget.closest('form')

    // Coleta os dados do formulário
    const rollData = {
      actor: this.actor,
      pool: parseInt(form.pool.value),
      difficulty: parseInt(form.difficulty.value),
      // Pega os dados de Paradoxo em vez de Fome
      hungerDice: parseInt(form.hunger_dice.value),
      rollType: 'mage', // Define um tipo customizado
      rollMode: form.rollMode.value,
      modifiers: this.modifiers
    }

    // Cria uma nova instância da nossa classe de rolagem customizada
    const roll = new MageRoll(rollData)

    // Envia o resultado para o chat
    roll.toMessage()

    this.close()
  }
}

/**
 * MageRoll
 * Uma classe customizada que estende a RollFormula base do vtm5e.
 * Ela recalcula os sucessos com base no Paradoxo, em vez da Fome.
 */
class MageRoll extends game.vtm5e.RollFormula {
  /**
   * @override
   * O "coração" da lógica de rolagem.
   * Substitui a contagem de Fome (Vampiro) pela contagem de Paradoxo (Mago).
   */
  _prepareData (rollData) {
    super._prepareData(rollData)

    // Pega os dados de Paradoxo (que enviamos como 'hungerDice' no diálogo)
    const paradoxDice = Math.max(0, this.hungerDice)

    // Lógica (simplificada) de Paradoxo:
    // 1. Separa os dados normais dos dados de Paradoxo
    this.dice = this.dice.slice(paradoxDice)
    const paradox = this.dice.slice(0, paradoxDice)

    // 2. Calcula sucessos/críticos normais
    const normalSuccesses = this.dice.filter(d => d.success).length
    const normalCrits = this.dice.filter(d => d.critical).length

    // 3. Calcula sucessos/críticos de Paradoxo
    const paradoxSuccesses = paradox.filter(d => d.success).length
    const paradoxCrits = paradox.filter(d => d.critical).length
    const paradoxFailures = paradox.filter(d => d.failure).length // '1' nos dados de Paradoxo

    // 4. Calcula o total de sucessos (críticos contam como 2)
    this.successes = normalSuccesses + (normalCrits * 2) + paradoxSuccesses + (paradoxCrits * 2)

    // 5. Define o resultado (VULGAR/COVERTIDO - ainda a implementar a lógica completa)
    // Por enquanto, vamos focar no básico:
    if (paradoxFailures > 0) {
      // Se algum dado de Paradoxo for '1', é um Backlash (Falha Bestial)
      this.outcome = 'bestial' // Reutilizando o termo do vtm5e
      this.outcomeLabel = game.i18n.localize('MTA.Backlash')
    } else if (this.successes === 0) {
      this.outcome = 'failure'
      this.outcomeLabel = game.i18n.localize('WOD5E.Chat.Failure')
    } else if (normalCrits > 0 || paradoxCrits > 0) {
      this.outcome = 'critical'
      this.outcomeLabel = game.i18n.localize('WOD5E.Chat.CriticalSuccess')
    } else {
      this.outcome = 'success'
      this.outcomeLabel = game.i18n.localize('WOD5E.Chat.Success')
    }

    // Define os ícones dos dados para o chat
    this.rollResults = {
      normal: {
        rolls: this.dice,
        icon: this.rollIcons.normal
      },
      paradox: {
        rolls: paradox,
        icon: this.rollIcons.hunger // Reutilizando o ícone
      }
    }
  }
}