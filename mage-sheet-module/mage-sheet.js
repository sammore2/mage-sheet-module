/* global foundry */

// Importamos a ficha de Mortal para herdar
import { MortalActorSheet } from '/systems/vtm5e/system/actor/mortal-actor-sheet.js';
const { HandlebarsApplicationMixin } = foundry.applications.api;

// Importamos as funções de preparação de dados de Mago
import {
    prepareSpheresContext,
    prepareAreteContext
} from './scripts/prepare-mage-partials.js';

// [NOVO] Importamos a AÇÃO CUSTOMIZADA
import { _onImbueEssence } from './scripts/mage-actions.js';

export class MageSheet extends HandlebarsApplicationMixin(MortalActorSheet) {

    // 0. DEFINIÇÃO DE AÇÕES
    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        // [NOVO] Adiciona a ação customizada para o botão de Rouse/Imbuir
        actions: {
            ...super.DEFAULT_OPTIONS.actions,
            imbueEssence: _onImbueEssence 
        }
    }

    // 1. DEFINIÇÃO DAS PARTES CUSTOMIZADAS (PARTS)
    static PARTS = {
      // [SOBRESCRITO] Template para o cabeçalho
      header: {
          template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs'
      },
      // ABA SPHERES: Usa o layout de Disciplinas
      spheres: {
        template: 'modules/mage-sheet-module/templates/actors/parts/spheres.hbs'
      },
      // ABA ARETE: Usa o layout de Blood/Recursos
      arete: {
        template: 'modules/mage-sheet-module/templates/actors/parts/arete.hbs'
      }
    }

    // 2. DEFINIÇÃO DAS ABAS NA BARRA DE NAVEGAÇÃO
    tabs = {
      ...super.tabs, 
      spheres: {
        id: 'spheres',
        group: 'primary',
        label: 'WOD5E.Mage.Spheres',
        icon: '<i class="fas fa-hat-wizard"></i>'
      },
      arete: {
        id: 'arete',
        group: 'primary',
        label: 'WOD5E.Mage.Arete',
        icon: '<i class="fas fa-crown"></i>'
      }
    }

    // 3. CAMINHO PARA O ARQUIVO PRINCIPAL
    get template () {
        if (this.actor.limited) return 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
        return 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs' 
    }
    
    // 4. PREPARADOR DE CONTEXTO PRINCIPAL (MAPEAMENTO DE REGRAS)
    async _prepareContext () {
        const data = await super._prepareContext()
        const actor = this.actor
        const actorData = actor.system

        // Mapeia PARADOX para o campo de dados 'hunger'
        data.paradox = actorData.hunger

        return data
    }
    
    // 5. PREPARADOR DE DADOS (Roteador para Partials)
    async _preparePartContext(partId, context, options) {
        context = { ...(await super._preparePartContext(partId, context, options)) };
        const actor = this.actor;

        switch (partId) {
            case 'spheres':
                return prepareSpheresContext(context, actor); 
            case 'arete':
                return prepareAreteContext(context, actor);
        }

        return context;
    }
}