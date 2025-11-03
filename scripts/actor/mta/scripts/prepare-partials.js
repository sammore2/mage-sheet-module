/* global foundry */

import { prepareSpherePowers } from './prepare-data.js'
import { getAreteText } from './arete.js' 

// ==================================================================================
// 1. FUNÇÕES GENÉRICAS (Definidas SEM o 'export' para evitar a duplicação)
// ==================================================================================

const prepareDescriptionContext = async function (context, item) { 
    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(item.system.description)
    return context
}

const prepareDicepoolContext = async function (context, item) { 
    context.dicepool = item.system.dicepool 
    return context
}

const prepareMacroContext = async function (context, item) { 
    context.macro = item.system.macro
    return context
}

const prepareModifiersContext = async function (context, item) { 
    context.modifiers = item.system.modifiers
    return context
}

const prepareItemSettingsContext = async function (context, item) { 
    context.itemSettings = item.system.settings
    return context
}

// ==================================================================================
// 2. FUNÇÕES CUSTOMIZADAS DE MAGO (Incluindo o prepareBaneContext do V5)
// ==================================================================================

// CLONANDO O NOME DA FUNÇÃO V5 QUE A FICHA TRADITION-ITEM-SHEET ESPERA.
// O arquivo original do CLAN (V5) importa prepareBaneContext.
const prepareBaneContext = async function (context, item) {
  const itemData = item.system
  // O nome da aba de Tradição será 'bane' (clonado do V5)
  context.tab = context.tabs.bane 

  // Data Mago
  context.bane = itemData.bane
  context.enrichedBane = await foundry.applications.ux.TextEditor.implementation.enrichHTML(itemData.bane)

  return context
}


const prepareSpheresContext = async function (context, actor) {
  const actorData = actor.system
  context.tab = context.tabs.spheres
  context.spheres = await prepareSpherePowers(actorData.spheres)
  if (actorData?.selectedSphere) {
    context.selectedSphere = actorData.spheres[actorData.selectedSphere]
    context.enrichedSelectedSphereDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.selectedSphere?.description || '')
  }
  if (actorData?.selectedSpherePower) {
    context.selectedSpherePower = await actor.items.get(actorData.selectedSpherePower)
    if (context.selectedSpherePower?.system?.description) {
      context.selectedSpherePowerDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.selectedSpherePower.system.description)
    }
  }
  return context
}


const prepareAreteContext = async function (context, actor) {
  const actorData = actor.system
  context.tab = context.tabs.blood
  context.arete = await getAreteText(actorData.arete.potency)
  context.paradox = actorData.paradox
  context.quintessence = actorData.quintessence
  return context
}

// ==================================================================================
// EXPORTAÇÃO FINAL ÚNICA (Isto resolve o erro na linha 97 e garante o prepareBaneContext)
// ==================================================================================
export { 
    prepareDescriptionContext, 
    prepareDicepoolContext, 
    prepareMacroContext, 
    prepareModifiersContext, 
    prepareItemSettingsContext,
    prepareBaneContext, // Adição da função exigida
    prepareSpheresContext, 
    prepareAreteContext 
}