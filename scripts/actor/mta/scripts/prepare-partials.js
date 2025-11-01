/* global foundry */

import { prepareSpherePowers } from './prepare-data.js'
// ****** MUDANÇA AQUI ******
// Trocamos 'getBloodPotencyText' por 'getAreteText' (que virá do seu 'arete.js' refatorado)
import { getAreteText } from './arete.js' 

export const prepareSpheresContext = async function (context, actor) {
  // ... (Esta função está 100% correta, não precisa mudar) ...
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.spheres

  // Part-specific data
  context.spheres = await prepareSpherePowers(actorData.spheres)

  // Get sphere data if any sphere is currently selected
  if (actorData?.selectedSphere) {
    context.selectedSphere = actorData.spheres[actorData.selectedSphere]
    context.enrichedSelectedSphereDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.selectedSphere?.description || '')
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedSpherePower) {
    context.selectedSpherePower = await actor.items.get(actorData.selectedSpherePower)

    if (context.selectedSpherePower?.system?.description) {
      context.selectedSpherePowerDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.selectedSpherePower.system.description)
    }
  }

  return context
}


// ****** ESTA É A FUNÇÃO TOTALMENTE REFATORADA ******
export const prepareAreteContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  // (No seu 'template.json' que sugeri, não há 'tabs.arete', 
  // então vamos nos basear no 'tabs.blood' que você copiou)
  context.tab = context.tabs.blood // (Você pode renomear isso no seu .hbs)

  // --- Dados de Mago ---
  
  // Pega os valores de Arete (do 'arete.js' refatorado)
  context.arete = await getAreteText(actorData.arete.potency)
  
  // Pega os valores de Paradoxo (do template.json)
  context.paradox = actorData.paradox
  
  // Pega os valores de Quintessência (do template.json)
  context.quintessence = actorData.quintessence

  // --- Dados de Vampiro (Limpando) ---
  // (Removemos sire, generation, predator, resonance, bane)

  return context
}