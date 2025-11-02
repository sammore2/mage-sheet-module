// Este import só vai rodar quando o 'hooks.js' mandar,
// então o 'mage-roll.js' (corrigido abaixo) não vai quebrar.
import { MageRollDialog } from './scripts/mage-roll.js';

/**
 * MageActorSheet
 * PADRÃO CORRETO: extends WOD5E.api.MortalActorSheet
 */
export class MageActorSheet extends WOD5E.api.MortalActorSheet {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['vtm5e', 'sheet', 'actor', 'mage'],
      template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs',
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'stats' }]
    });
  }

  async getData () {
    const data = await super.getData();
    this._prepareMageData(data.actor);
    data.actor.system.tabs = {
      stats: true,
      spheres: true,
      equipment: true,
      features: true,
      biography: true,
      experience: true,
      notepad: true,
      settings: true
    };
    return data;
  }

  _prepareMageData (actorData) {
    const system = actorData.system;
    system.sortedSpheres = Object.entries(system.spheres).map(([key, sphere]) => {
      return {
        key: key,
        label: game.i18n.localize(`MTA.Sphere.${key}`),
        ...sphere
      };
    });
  }

  activateListeners (html) {
    super.activateListeners(html);
    if (this.actor.system.locked) return;
    html.find('.roll-arete').click(this._onRollArete.bind(this));
    html.find('.roll-paradox').click(this._onRollParadox.bind(this));
    html.find('.roll-wisdom').click(this._onRollWisdom.bind(this));
  }

  async _onRollArete (event) {
    event.preventDefault();
    const sphereOptions = this.actor.system.sortedSpheres.map(s => ({
      key: s.key,
      label: s.label,
      value: s.value
    }));
    sphereOptions.unshift({
      key: 'none',
      label: game.i18n.localize('VTM5E.None'),
      value: 0
    });
    
    const dialog = new MageRollDialog({ // Classe importada
      actor: this.actor,
      title: game.i18n.localize('MTA.Roll.Arete'),
      pool1: { label: game.i18n.localize('MTA.Arete'), value: this.actor.system.arete.value },
      pool2: { label: game.i18n.localize('MTA.Sphere'), hasSelect: true, options: sphereOptions }
    });
    dialog.render(true);
  }

  async _onRollWisdom (event) {
    event.preventDefault();
    const system = this.actor.system;
    const remainingWisdom = system.wisdom.value - system.wisdom.stains;
    
    // PADRÃO CORRETO: usa a classe base de WOD5E.api
    const roll = new WOD5E.api.RollFormula({ 
      actor: this.actor,
      pool: remainingWisdom,
      difficulty: 1,
      rollType: 'remorse',
      title: game.i18n.localize('MTA.Roll.Wisdom')
    });
    await roll.toMessage();
    this.actor.update({ 'system.wisdom.stains': 0 });
  }

  async _onRollParadox (event) {
    event.preventDefault();
    const system = this.actor.system;
    const paradox = system.paradox.value;

    // PADRÃO CORRETO: usa a classe base de WOD5E.api
    const roll = new WOD5E.api.RollFormula({
      actor: this.actor,
      pool: paradox,
      difficulty: 1,
      rollType: 'frenzy',
      title: game.i18n.localize('MTA.Roll.Backlash')
    });
    await roll.toMessage();
  }
}