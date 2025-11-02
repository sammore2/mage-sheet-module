// AGORA é seguro estender, pois este arquivo só é carregado dentro do 'init'

/**
 * MageRoll
 * Estende a RollFormula base para usar Paradoxo.
 */
export class MageRoll extends WOD5E.api.Roll {
  _prepareData (rollData) {
    super._prepareData(rollData);
    const paradoxDice = Math.max(0, this.hungerDice);
    this.dice = this.dice.slice(paradoxDice);
    const paradox = this.dice.slice(0, paradoxDice);
    const normalSuccesses = this.dice.filter(d => d.success).length;
    const normalCrits = this.dice.filter(d => d.critical).length;
    const paradoxSuccesses = paradox.filter(d => d.success).length;
    const paradoxCrits = paradox.filter(d => d.critical).length;
    const paradoxFailures = paradox.filter(d => d.failure).length;
    this.successes = normalSuccesses + (normalCrits * 2) + paradoxSuccesses + (paradoxCrits * 2);

    if (paradoxFailures > 0) {
      this.outcome = 'bestial';
      this.outcomeLabel = game.i18n.localize('MTA.Backlash');
    } else if (this.successes === 0) {
      this.outcome = 'failure';
      this.outcomeLabel = game.i18n.localize('VTM5E.Chat.Failure');
    } else if (normalCrits > 0 || paradoxCrits > 0) {
      this.outcome = 'critical';
      this.outcomeLabel = game.i18n.localize('VTM5E.Chat.CriticalSuccess');
    } else {
      this.outcome = 'success';
      this.outcomeLabel = game.i18n.localize('VTM5E.Chat.Success');
    }
    this.rollResults = {
      normal: { rolls: this.dice, icon: this.rollIcons.normal },
      paradox: { rolls: paradox, icon: this.rollIcons.hunger }
    };
  }
}

/**
 * MageRollDialog
 * Estende VampireRollDialog para reutilizar a lógica de "hunger".
 */
export class MageRollDialog extends WOD5E.api.Roll {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: 'modules/mage-sheet-module/templates/ui/mage-roll-dialog.hbs'
    });
  }
  async getData () {
    const data = await super.getData();
    data.hungerValue = this.actor.system.paradox.value;
    data.hungerLabel = game.i18n.localize('MTA.Paradox');
    // data.hungerDiceIcon = 'assets/icons/dialog/vampire-dice.png'; // (Você pode mudar isso)
    return data;
  }
  _onRoll (event) {
    event.preventDefault();
    const form = event.currentTarget.closest('form');
    const combinedPool = parseInt(form.pool1.value) + parseInt(form.pool2.value);
    const rollData = {
      actor: this.actor,
      pool: combinedPool,
      difficulty: parseInt(form.difficulty.value),
      hungerDice: parseInt(form.hunger_dice.value),
      rollType: 'mage',
      rollMode: form.rollMode.value,
      modifiers: this.modifiers
    };
    const roll = new MageRoll(rollData); // Usa a classe MageRoll definida acima
    roll.toMessage();
    this.close();
  }
}