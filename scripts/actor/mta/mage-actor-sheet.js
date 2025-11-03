// scripts/actor/mta/mage-actor-sheet.js

// Importa a classe base da ficha de mortal (necessário para herdar corretamente)
import { MortalActorSheet } from '/systems/vtm5e/system/actor/mortal-actor-sheet.js';

/* global WOD5E, foundry, game */

/**
 * MageActorSheet
 * Herda da ficha de mortal
 */
export class MageActorSheet extends MortalActorSheet {
  /** @override */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['vtm5e', 'sheet', 'actor', 'mage'],
      template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs',
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'stats' }]
    });
  }

  /** @override */
  async getData () {
    const data = await super.getData();
    // Garante que a aba de esferas apareça na ficha
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
    
    this._prepareMageData(data.actor);

    return data;
  }

  // Prepara os dados de Arete e Esferas
  _prepareMageData (actorData) {
    const system = actorData.system;

    // Converte as esferas em um array ordenado para o Handlebars
    system.sortedSpheres = Object.entries(system.spheres).map(([key, sphere]) => {
      return {
        key: key,
        label: game.i18n.localize(`MTA.Sphere.${key}`),
        value: sphere.value
      };
    });
  }

  /** @override */
  activateListeners (html) {
    super.activateListeners(html); 

    // Listener customizado para a rolagem de Arete/Magia
    html.find('.rollable[data-roll-type="arete"]').click(this._onRollArete.bind(this));
    html.find('.rollable[data-roll-type="wisdom"]').click(this._onRollWisdom.bind(this));
  }

  /**
   * Lida com a rolagem de Magia (Arete + Esfera)
   */
  async _onRollArete (event) {
    event.preventDefault();

    // CHAMA A API OFICIAL do WOD5E
    WOD5E.api.RollFromDataset({
      dataset: {
        selectDialog: true, 
        attribute: 'arete', 
        title: game.i18n.localize('MTA.Roll.Arete') 
      }
    }, this.actor);
  }

  /**
   * Lida com a rolagem de Sabedoria/Remorso
   */
  async _onRollWisdom (event) {
    event.preventDefault();
    const system = this.actor.system;
    const remainingWisdom = system.wisdom.value - system.wisdom.stains;
    
    // CHAMA A API OFICIAL do WOD5E
    WOD5E.api.Roll({ 
      basicDice: remainingWisdom,
      actor: this.actor,
      difficulty: 1, 
      title: game.i18n.localize('MTA.Roll.Wisdom'),
      flavor: game.i18n.localize('MTA.Roll.WisdomFlavor')
    });
  }
}