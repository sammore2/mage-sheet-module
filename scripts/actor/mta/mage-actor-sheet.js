/* global foundry */

// =======================================================================
// IMPORTAÇÕES DAS "PARTES" DO SISTEMA (Os "Blocos de Lego" do WoD5E)
// =======================================================================
import { 
  prepareBiographyContext, 
  prepareExperienceContext, 
  prepareFeaturesContext, 
  prepareEquipmentContext, 
  prepareNotepadContext, 
  prepareSettingsContext, 
  prepareStatsContext, 
  prepareLimitedContext 
} from '/systems/vtm5e/system/actor/scripts/prepare-partials.js'

// =======================================================================
// IMPORTAÇÕES DAS "PARTES" DO SEU MÓDULO (Do arquivo que você enviou)
// =======================================================================
import { 
  prepareSpheresContext,
  prepareAreteContext // Você criou esta, vamos usá-la!
} from './scripts/prepare-partials.js' // O arquivo que você acabou de me mostrar

// --- Funções de Clique (As suas) ---
import { _onParadoxCheck } from './scripts/paradox-roll.js' 
import { _onWisdomRoll } from './scripts/wisdom-roll.js' 
import { _onParadoxBacklash } from './scripts/paradox-backlash.js' 
import { _onEndParadoxBacklash } from './scripts/end-paradox-backlash.js' 

// --- Base (Como o Vampiro faz) ---
import { WoDActor } from '/systems/vtm5e/system/actor/wod-actor-base.js'
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * MageActorSheet
 * Segue a "Lógica do Vampiro" (Arquitetura de Partes)
 */
export class MageActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'mage'],
    // REMOVEMOS a linha 'template: "..."' daqui.
    
    // Mapeia os listeners de Mago
    // NOTA: Mude seu .HBS para usar 'data-action="paradoxCheck"' em vez de 'data-action="rouse-check"', etc.
    actions: {
      paradoxCheck: _onParadoxCheck,
      wisdomRoll: _onWisdomRoll,
      paradoxBacklash: _onParadoxBacklash,
      endParadoxBacklash: _onEndParadoxBacklash
    }
  }

  // =======================================================================
  // O "KIT LEGO" (Definindo os arquivos .HBS)
  // =======================================================================
  static PARTS = {
    header: {
      // O seu header customizado (que já vimos e está perfeito)
      template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs'
    },
    tabs: {
      // O .hbs padrão do sistema para os botões das abas
      template: 'systems/vtm5e/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      // O .hbs padrão do sistema para Atributos e Perícias (o 'stats.hbs' que você enviou)
      template: 'systems/vtm5e/display/shared/actors/parts/stats.hbs'
    },
    
    // --- SUAS PARTES CUSTOMIZADAS ---
    arete: { // Para Arete, Paradoxo, Quintessência (baseado no seu 'prepareAreteContext')
      template: 'modules/mage-sheet-module/templates/actors/parts/arete.hbs' // Você precisará criar este .hbs
    },
    spheres: { // Para as Esferas
      template: 'modules/mage-sheet-module/templates/actors/parts/spheres.hbs' // Você já tem este .hbs
    },
    // --- FIM DAS PARTES CUSTOMIZADAS ---

    features: {
      template: 'systems/vtm5e/display/shared/actors/parts/features.hbs'
    },
    equipment: {
      template: 'systems/vtm5e/display/shared/actors/parts/equipment.hbs'
    },
    biography: {
      template: 'systems/vtm5e/display/shared/actors/parts/biography.hbs'
    },
    notepad: {
      template: 'systems/vtm5e/display/shared/actors/parts/notepad.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/actors/parts/actor-settings.hbs'
    },
    banner: {
      template: 'systems/vtm5e/display/shared/actors/parts/type-banner.hbs'
    },
    limited: {
      template: 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    },
    experience: { // Adicionando a aba de Experiência que faltava
      template: 'systems/vtm5e/display/shared/actors/parts/experience.hbs'
    }
  }

  // =======================================================================
  // OS BOTÕES DAS ABAS (Adaptado do Vampiro)
  // =======================================================================
  tabs = {
    stats: {
      id: 'stats',
      group: 'primary',
      title: 'WOD5E.Tabs.Stats',
      icon: '<i class="fa-regular fa-chart-line"></i>'
    },
    arete: { // <- SEU BOTÃO (Baseado no seu 'prepareAreteContext')
      id: 'arete',
      group: 'primary',
      title: 'WOD5E.MTA.Arete', // (Use sua chave de tradução)
      icon: '<i class="fas fa-star"></i>' 
    },
    spheres: { // <- SEU BOTÃO (Baseado no seu 'prepareSpheresContext')
      id: 'spheres',
      group: 'primary',
      title: 'WOD5E.MTA.Spheres', // (Use sua chave de tradução)
      icon: '<i class="fas fa-globe"></i>'
    },
    features: {
      id: 'features',
      group: 'primary',
      title: 'WOD5E.Tabs.Features',
      icon: '<i class="fas fa-gem"></i>'
    },
    equipment: {
      id: 'equipment',
      group: 'primary',
      title: 'WOD5E.Tabs.Equipment',
      icon: '<i class="fa-solid fa-toolbox"></i>'
    },
    biography: {
      id: 'biography',
      group: 'primary',
      title: 'WOD5E.Tabs.Biography',
      icon: '<i class="fas fa-id-card"></i>'
    },
     experience: { // Adicionando a aba de Experiência
      id: 'experience',
      group: 'primary',
      title: 'WOD5E.Tabs.Experience',
      icon: '<i class="fa-solid fa-file-contract"></i>'
    },
    notepad: {
      id: 'notepad',
      group: 'primary',
      title: 'WOD5E.Tabs.Notes',
      icon: '<i class="fas fa-sticky-note"></i>'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      title: 'WOD5E.Tabs.Settings',
      icon: '<i class="fa-solid fa-gears"></i>'
    }
  }

  // =======================================================================
  // O "MAESTRO" (Carregando os dados para cada "Parte")
  // =======================================================================
  async _preparePartContext (partId, context, options) {
    context = { ...(await super._preparePartContext(partId, context, options)) }
    const actor = this.actor

    // O "switch" que chama a função de preparação correta para cada parte
    switch (partId) {
      // --- Partes do Sistema ---
      case 'stats':
        return prepareStatsContext(context, actor)
      case 'features':
        return prepareFeaturesContext(context, actor)
      case 'equipment':
        return prepareEquipmentContext(context, actor)
      case 'biography':
        return prepareBiographyContext(context, actor)
      case 'experience':
        return prepareExperienceContext(context, actor)
      case 'notepad':
        return prepareNotepadContext(context, actor)
      case 'settings':
        return prepareSettingsContext(context, actor)
      case 'limited':
        return prepareLimitedContext(context, actor)

      // --- Suas Partes Customizadas ---
      case 'arete':
        // Chama a função do seu 'prepare-partials.js'
        return prepareAreteContext(context, actor) 
      case 'spheres':
        // Chama a função do seu 'prepare-partials.js'
        return prepareSpheresContext(context, actor) 
    }
    return context
  }
}