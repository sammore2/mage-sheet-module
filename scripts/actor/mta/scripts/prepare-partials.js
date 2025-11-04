/* global foundry */

// 1. CORRIGIDO: Importa AMBAS as funções do arete.js
import { getAreteValues, getAreteText } from './arete.js' 
// Importa a lógica de preparação das Esferas (que já estava)
import { prepareSpherePowers } from './prepare-data.js'

// ==================================================================================
// 2. FUNÇÕES GENÉRICAS (As suas funções, copiadas do seu original)
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
// 3. FUNÇÕES CUSTOMIZADAS (A sua lógica, agora com 'prepareAreteContext' corrigida)
// ==================================================================================

// A sua função de "Bane" (Tradição) - Perfeita, continua igual
const prepareBaneContext = async function (context, item) {
  const itemData = item.system
  context.tab = context.tabs.bane 
  context.bane = itemData.bane
  context.enrichedBane = await foundry.applications.ux.TextEditor.implementation.enrichHTML(itemData.bane)
  return context
}

// A sua função de Esferas - Perfeita, continua igual
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


// *** A CORREÇÃO ESTÁ AQUI ***
// (Baseada na nossa análise)
const prepareAreteContext = async function (context, actor) {
  const actorData = actor.system
  // Garante que o nível seja 0-10
  const areteLevel = actor.system.arete.potency || 0 

  // CHAMA A SUA "MECÂNICA PRÓPRIA" (arete.js)
  // Isso busca o objeto: { paradoxDice: 1, roteBonus: 0, ... }
  context.areteValues = await getAreteValues(areteLevel) 

  // CHAMA A FUNÇÃO DE TEXTO (para a descrição)
  context.areteText = await getAreteText(areteLevel)

  // PASSE OS DADOS RESTANTES (como você já fazia, mais os que faltavam)
  context.tab = context.tabs.blood // Correto, "sequestra" a aba blood
  context.paradox = actorData.paradox
  context.quintessence = actorData.quintessence
  // Passa o { potency } para o .hbs (para o tracker de pontos)
  context.areteRating = actorData.arete 
  context.wisdom = actorData.wisdom // Passa os dados de Sabedoria

  return context
}

// ==================================================================================
// EXPORTAÇÃO FINAL (Incluindo todas as suas funções)
// ==================================================================================
export { 
    prepareDescriptionContext, 
    prepareDicepoolContext, 
    prepareMacroContext, 
    prepareModifiersContext, 
    prepareItemSettingsContext,
    prepareBaneContext, 
    prepareSpheresContext, 
    prepareAreteContext // A função corrigida
}