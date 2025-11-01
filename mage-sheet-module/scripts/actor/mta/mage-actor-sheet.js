/* global foundry, game */

// --- 1. IMPORTAÇÕES GLOBAIS (CAMINHOS CORRIGIDOS) ---
// Adicionada a barra '/' no início para ser um caminho absoluto
import { 
  prepareBiographyContext, 
  prepareExperienceContext, 
  prepareFeaturesContext, 
  prepareEquipmentContext, 
  prepareNotepadContext, 
  prepareSettingsContext, 
  prepareStatsContext, 
  prepareLimitedContext 
} from '/systems/vtm5e/system/actor/scripts/prepare-partials.js' //

// --- 2. IMPORTAÇÕES LOCAIS (Suas importações, intactas) ---
import { prepareSpheresContext, prepareAreteContext } from './scripts/prepare-partials.js' //
import { _onAddSphere, _onSphereToChat, _onRemoveSphere, _onSelectSphere, _onSelectSpherePower } from './scripts/spheres.js'

// Importando os NOVOS nomes de arquivo e função
import { _onParadoxBacklash } from './scripts/paradox-backlash.js'
import { _onEndParadoxBacklash } from './scripts/end-paradox-backlash.js'
import { _onWisdomRoll } from './scripts/wisdom-roll.js'

// Importando a mecânica de rolagem de Paradoxo
import { _onParadoxCheck } from './scripts/paradox-roll.js'

// --- 3. IMPORTAÇÃO DA CLASSE BASE (ADICIONADA) ---
// Esta importação estava faltando, o que causava o erro
import { WoDActor } from '/systems/vtm5e/system/actor/wod-actor-base.js' //

// Mixin padrão do Foundry (Seu código, intacto)
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
// Agora 'WoDActor' está definido e esta linha funciona
export class MageActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  // (Seu código, intacto)
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'mage'],
    actions: {
      // Ações das Esferas
      addSphere: _onAddSphere,
      removeSphere: _onRemoveSphere,
      sphereChat: _onSphereToChat,
      selectSphere: _onSelectSphere,
      selectSpherePower: _onSelectSpherePower,

      // --- AÇÕES COM NOME CORRETO ---
      rollWisdom: _onWisdomRoll,
      resistBacklash: _onParadoxBacklash,
      endBacklash: _onEndParadoxBacklash
    }
  }

  //
  // --- SEU CÓDIGO 'STATIC PARTS' (ADICIONADO E CORRIGIDO) ---
  // (Isto estava faltando, e os caminhos foram corrigidos)
  //
  static PARTS = {
    header: {
      // Corrigido para 'templates/' (sua estrutura) e 'mage-sheet.hbs'
      template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs' //
    },
    tabs: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/tab-navigation.hbs' //
    },
    stats: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/stats.hbs' //
    },
    experience: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/experience.hbs' //
    },
    spheres: {
      // Corrigido para 'templates/' (sua estrutura)
      template: 'modules/mage-sheet-module/templates/actors/parts/spheres.hbs' //
    },
    arete: {
      // Corrigido para 'templates/' (sua estrutura)
      template: 'modules/mage-sheet-module/templates/actors/parts/arete.hbs' //
    },
    features: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/features.hbs' //
    },
    equipment: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/equipment.hbs' //
    },
    biography: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/biography.hbs' //
    },
    notepad: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/notepad.hbs' //
    },
    settings: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/actor-settings.hbs' //
    },
    banner: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/parts/type-banner.hbs' //
    },
    limited: {
      // Corrigido para caminho absoluto do sistema
      template: '/systems/vtm5e/display/shared/actors/limited-sheet.hbs' //
    }
  }

  //
  // --- SEU CÓDIGO 'tabs' (ADICIONADO E INTACTO) ---
  //
  tabs = {
    stats: {
      id: 'stats',
      group: 'primary',
      title: 'WOD5E.Tabs.Stats',
      icon: '<i class="fa-regular fa-chart-line"></i>'
    },
    experience: {
      id: 'experience',
      group: 'primary',
      title: 'WOD5E.Tabs.Experience',
      icon: '<i class="fa-solid fa-file-contract"></i>'
    },
    spheres: {
      id: 'spheres',
      group: 'primary',
      title: 'WOD5E.MTA.Spheres', // (Corrigi a quebra de linha)
      icon: '<span class="wod5e-symbol">b</span>'
    },
    arete: {
      id: 'arete',
      group: 'primary',
      title: 'WOD5E.MTA.Arete',
      icon: '<i class="fa-solid fa-droplet"></i>'
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

  /** @override */
  // (Seu código, intacto, mas corrigi o caminho para 'templates/')
  get template () {
    return 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs' //
  }

  /** @override */
  // (Seu código, intacto)
  async _prepareContext (options) {
    // ... (Esta função que te mandei antes está correta) ...
    const context = await super._prepareContext(options)
    const actorData = this.actor.system

    context.arete = actorData.arete
    context.paradox = actorData.paradox
    context.quintessence = actorData.quintessence
    context.wisdom = actorData.wisdom
    context.frenzyActive = actorData.frenzyActive // (Nosso boolean de Backlash)

    delete context.humanity
    delete context.hunger
    delete context.clan

    return context
  }

  /** @override */
  // (Seu código, intacto)
  async _preparePartContext (partId, context, options) {
    // ... (Esta função que te mandei antes está correta) ...
    context = { ...(await super._preparePartContext(partId, context, options)) }
    const actor = this.actor

    switch (partId) {
      // Abas Padrão
      case 'stats':
        return prepareStatsContext(context, actor)
      case 'experience':
        return prepareExperienceContext(context, actor)
      case 'features':
        return prepareFeaturesContext(context, actor)
      case 'equipment':
        return prepareEquipmentContext(context, actor)
      case 'biography':
        return prepareBiographyContext(context, actor)
      case 'notepad':
        return prepareNotepadContext(context, actor)
      case 'settings':
        return prepareSettingsContext(context, actor)
      case 'limited':
        return prepareLimitedContext(context, actor)

      // Suas Abas Customizadas
      case 'spheres':
        return prepareSpheresContext(context, actor) //
      case 'arete':
        return prepareAreteContext(context, actor) //
    }

    return context
  }

  // --- A "PONTE" (Seu código, intacto) ---
  /**
   * Intercepta a chamada de "Rouse Check" do sistema e
   * a redireciona para o nosso "Paradox Check".
   */
  async _onRouseCheck (actor, item, rollMode) {
    await _onParadoxCheck(actor, item, rollMode)
  }
}
