/* global foundry, game */

// --- 1. IMPORTAÇÕES GLOBAIS (Corrigido) ---
const { WoDActor } = game.wod5e
const { HandlebarsApplicationMixin } = foundry.applications.api
const {
  prepareBiographyContext,
  prepareExperienceContext,
  prepareFeaturesContext,
  prepareEquipmentContext,
  prepareNotepadContext,
  prepareSettingsContext,
  prepareStatsContext,
  prepareLimitedContext
} = game.wod5e.api

// --- 2. IMPORTAÇÕES LOCAIS (AGORA 100% CORRETAS) ---
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

  /** @override */
  get template () {
    return 'modules/mage-sheet-module/display/actors/mage-sheet.hbs'
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