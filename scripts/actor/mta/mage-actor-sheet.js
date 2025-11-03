// scripts/actor/mta/mage-actor-sheet.js
/* global mergeObject */

// CORREÇÃO: Importa a classe real (WoDActor) do arquivo base do sistema
import { WoDActor } from "/systems/vtm5e/system/actor/wod-actor-base.js"; 

/**
 * MageActorSheet
 * PADRÃO CORRETO: estende a classe WoDActor, que é a ficha base
 */
export class MageActorSheet extends WoDActor {
  static get defaultOptions() {
    // Usamos mergeObject da foundry.utils, que é global após o init
    return mergeObject(super.defaultOptions, { 
      classes: ["wod5e", "sheet", "actor", "mage"],
      template: "modules/mage-sheet-module/templates/actors/mage-sheet.hbs", // Corrigido para .hbs
      width: 800,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  getData() {
    const data = super.getData();
    // Você faria a preparação dos dados do Mago aqui (Areté, Esferas)
    // O template do sistema já traz todos os dados, mas sua lógica customizada iria aqui.
    return data;
  }
  
  // O restante das suas funções de listener (_onRollArete, _onRollWisdom) viria aqui.
}