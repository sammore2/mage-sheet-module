/* global foundry, game */

// --- 1. IMPORTAÇÕES DO SISTEMA BASE (CAMINHOS ABSOLUTOS) ---
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

import { WoDActor } from '/systems/vtm5e/system/actor/wod-actor-base.js' 


// --- 2. IMPORTAÇÕES LOCAIS (CAMINHOS RELATIVOS CORRIGIDOS) ---
import { prepareSpheresContext, prepareAreteContext } from './scripts/prepare-partials.js' 
import { _onAddSphere, _onSphereToChat, _onRemoveSphere, _onSelectSphere, _onSelectSpherePower } from './scripts/spheres.js'

// Importando os NOVOS nomes de arquivo e função
import { _onParadoxBacklash } from './scripts/paradox-backlash.js'
import { _onEndParadoxBacklash } from './scripts/end-paradox-backlash.js'
import { _onWisdomRoll } from './scripts/wisdom-roll.js'

// Importando a mecânica de rolagem de Paradoxo
import { _onParadoxCheck } from './scripts/paradox-roll.js'

const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class MageActorSheet extends HandlebarsApplicationMixin(WoDActor) {

  // DEFINIÇÕES STATIC PARTS: Caminhos de templates explícitos
  static PARTS = {
    header: {
      template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs' 
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
      template: 'modules/mage-sheet-module/templates/actors/parts/spheres.hbs' 
    },
    arete: {
      template: 'modules/mage-sheet-module/templates/actors/parts/arete.hbs' 
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

  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'mage'],
    actions: {
      // Ações das Esferas
      addSphere: _onAddSphere,
      removeSphere: _onRemoveSphere,
      sphereChat: _onSphereToChat,
      selectSphere: _onSelectSphere,
      selectSpherePower: _onSelectSpherePower,

      // --- AÇÕES DE MECÂNICA ---
      rollWisdom: _onWisdomRoll,
      resistBacklash: _onParadoxBacklash,
      endBacklash: _onEndParadoxBacklash
    }
  }
  
  get template () {
    return 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs' 
  }
  
  async _prepareContext (options) {
    const context = await super._prepareContext(options)
    const actorData = this.actor.system

    context.arete = actorData.arete
    context.paradox = actorData.paradox
    context.quintessence = actorData.quintessence
    context.wisdom = actorData.wisdom
    context.frenzyActive = actorData.frenzyActive 

    delete context.humanity
    delete context.hunger
    delete context.clan

    return context
  }
  
  async _preparePartContext (partId, context, options) {
    context = { ...(await super._preparePartContext(partId, context, options)) }
    const actor = this.actor

    switch (partId) {
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

  // PONTE: Intercepta a chamada de "Rouse Check" e redireciona para o nosso "Paradox Check".
  async _onRouseCheck (actor, item, rollMode) {
    await _onParadoxCheck(actor, item, rollMode)
  }
}