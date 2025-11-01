/* global foundry, game */
import { prepareBiographyContext, prepareExperienceContext, prepareFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareStatsContext, prepareLimitedContext } from 'systems/vtm5e/system/actor/scripts/prepare-partials.js'
import { prepareSpheresContext, prepareAreteContext } from './scripts/prepare-partials.js'
import { _onAddSphere, _onSphereToChat, _onRemoveSphere, _onSelectSphere, _onSelectSpherePower } from './scripts/spheres.js'

// Importando os NOVOS nomes de arquivo e função
import { _onParadoxBacklash } from './scripts/paradox-backlash.js'
import { _onEndParadoxBacklash } from './scripts/end-paradox-backlash.js'
import { _onWisdomRoll } from './scripts/wisdom-roll.js'

// Importando a mecânica de rolagem de Paradoxo
import { _onParadoxCheck } from './scripts/paradox-roll.js'

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class MageActorSheet extends HandlebarsApplicationMixin(WoDActor) {
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
      // (O 'data-action' no seu .hbs deve bater com estes nomes)
      rollWisdom: _onWisdomRoll,
      resistBacklash: _onParadoxBacklash,
      endBacklash: _onEndParadoxBacklash
    }
  }

  /** @override 
  get template () {
    return 'modules/mage-sheet-module/display/actors/mage-sheet.hbs'
  }
*/

  static PARTS = {
    header: {
      template: 'modules/mage-sheet-module/display/actors/mage-sheet.hbs'
    },
    tabs: {
      template: 'systems/vtm5e/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      template: 'systems/vtm5e/display/shared/actors/parts/stats.hbs'
    },
    experience: {
      template: 'systems/vtm5e/display/shared/actors/parts/experience.hbs'
    },
    spheres: {
      template: 'modules/mage-sheet-module/display/actors/spheres.hbs'
    },
    arete: {
      template: 'modules/mage-sheet-module/display/actors/arete.hbs'
    },
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
    }
  }

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
      title: 'WOD5E.MTA.Spheres
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
        return prepareSpheresContext(context, actor)
      case 'arete':
        return prepareAreteContext(context, actor)
    }

    return context
  }

  // --- A "PONTE" (Correta) ---
  /**
   * Intercepta a chamada de "Rouse Check" do sistema e
   * a redireciona para o nosso "Paradox Check".
   */
  async _onRouseCheck (actor, item, rollMode) {
    await _onParadoxCheck(actor, item, rollMode)
  }
}
