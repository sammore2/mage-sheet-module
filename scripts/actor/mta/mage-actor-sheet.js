// scripts/actor/mta/mage-actor-sheet.js
/* global mergeObject */

// Importa a classe WoDActor do sistema base (para estender)
import { WoDActor } from "/systems/vtm5e/system/actor/wod-actor-base.js"; 

// Importa todas as funções de lógica de Mago
import { _onParadoxCheck } from '../../scripts/actor/mta/scripts/paradox-roll.js' 
import { _onWisdomRoll } from '../../scripts/actor/mta/scripts/wisdom-roll.js' 
import { _onParadoxBacklash } from '../../scripts/actor/mta/scripts/paradox-backlash.js' 
import { _onEndParadoxBacklash } from '../../scripts/actor/mta/scripts/end-paradox-backlash.js' 


/**
 * MageActorSheet
 * Estende a classe base de Ficha de Ator do WoD5e.
 */
export class MageActorSheet extends WoDActor {
  
  static get defaultOptions() {
    // Usamos mergeObject da foundry.utils, que é global após o init
    return mergeObject(super.defaultOptions, { 
      classes: ["wod5e", "sheet", "actor", "mage"],
      template: "modules/mage-sheet-module/templates/actors/mage-sheet.hbs", // Template que você irá criar
      width: 800,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  getData() {
    const data = super.getData();
    // O MageActor.js já fez o prepareDerivedData (cálculo de esferas, etc.)
    return data;
  }
  
  /**
   * @override
   * Mapeia os eventos de clique do V5 para as novas funções de Mago.
   */
  activateListeners (html) {
    super.activateListeners(html); // Mantém os listeners base do WoD5e (clique em atributo/perícia)

    // 1. Paradoxo Check (Substitui o Rouse Check do V5)
    // O template deve usar o seletor V5 '.rouse-check'
    html.find('.rouse-check').click(_onParadoxCheck.bind(this)); 

    // 2. Teste de Sabedoria (Substitui o Remorse Roll do V5)
    // O template deve usar o seletor V5 '.remorse-roll'
    html.find('.remorse-roll').click(_onWisdomRoll.bind(this)); 

    // 3. Diálogo de Silêncio/Rebote (Substitui o Frenzy Roll V5)
    // O template deve usar o seletor V5 '.frenzy-roll'
    html.find('.frenzy-roll').click(_onParadoxBacklash.bind(this)); 

    // 4. Fim de Silêncio (Substitui o End Frenzy V5)
    // O template deve usar o seletor V5 '.end-frenzy'
    html.find('.end-frenzy').click(_onEndParadoxBacklash.bind(this)); 
  }
}