/* global foundry */

// Importa as funções de preparação de dados de CADA tipo de ator
// (como o arquivo "geral" do sistema faz)
import { prepareEdgePowers } from '../../../../../../systems/vtm5e/system/actor/htr/scripts/prepare-data.js'
import { prepareDisciplinePowers } from '../../../../../../systems/vtm5e/system/actor/vtm/scripts/prepare-data.js'
import { prepareGiftPowers } from '../../../../../../systems/vtm5e/system/actor/wta/scripts/prepare-data.js'

// Importa a sua própria função (do seu 'prepare-data.js')
import { prepareSpherePowers } from './prepare-data.js'

//
// --- ESTA É A FUNÇÃO 'FEATURES' COPIADA DO SISTEMA E MODIFICADA ---
// (Esta é a exportação que está faltando e causando o erro)
//
export const prepareFeaturesContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.features

  // Part-specific data
  context.concept = actorHeaders.concept
  context.chronicle = actorHeaders.chronicle
  context.ambition = actorHeaders.ambition
  context.desire = actorHeaders.desire
  context.features = actorData.features
  context.tenets = actorHeaders.tenets
  context.enrichedTenets = await foundry.applications.ux.TextEditor.implementation.enrichHTML(actorHeaders.tenets)
  context.touchstones = actorHeaders.touchstones
  context.enrichedTouchstones = await foundry.applications.ux.TextEditor.implementation.enrichHTML(actorHeaders.touchstones)
  context.showAmbitionDesire = actorData.gamesystem !== 'werewolf' && actor.type !== 'group/* global foundry */

// --- CAMINHOS DE IMPORTAÇÃO CORRIGIDOS ---
// (Caminhos do sistema como absolutos)
import { prepareEdgePowers } from '/systems/vtm5e/system/actor/htr/scripts/prepare-data.js'
import { prepareDisciplinePowers } from '/systems/vtm5e/system/actor/vtm/scripts/prepare-data.js'
import { prepareGiftPowers } from '/systems/vtm5e/system/actor/wta/scripts/prepare-data.js'

// --- CAMINHO LOCAL CORRIGIDO ---
// (Como está na mesma pasta, usamos './')
import { prepareSpherePowers } from './prepare-data.js'

//
// --- ESTA É A FUNÇÃO 'FEATURES' COPIADA DO SISTEMA E MODIFICADA ---
//
export const prepareFeaturesContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.features

  // Part-specific data
  context.concept = actorHeaders.concept
  context.chronicle = actorHeaders.chronicle
  context.ambition = actorHeaders.ambition
  context.desire = actorHeaders.desire
  context.features = actorData.features
  context.tenets = actorHeaders.tenets
  context.enrichedTenets = await foundry.applications.ux.TextEditor.implementation.enrichHTML(actorHeaders.tenets)
  context.touchstones = actorHeaders.touchstones
  context.enrichedTouchstones = await foundry.applications.ux.TextEditor.implementation.enrichHTML(actorHeaders.touchstones)
  context.showAmbitionDesire = actorData.gamesystem !== 'werewolf' && actor.type !== 'group'

  // Lógica de Vantagens (Features)
  if (context.currentActorType === 'hunter') {
    context.edges = await prepareEdgePowers(actorData.edges)
  }
  if (context.currentActorType === 'vampire') {
    context.disciplines = await prepareDisciplinePowers(actorData.disciplines)
  }
  if (context.gamesystem === 'werewolf') {
    const tribe = context.tribe
    context.gifts = await prepareGiftPowers(actorData.gifts)
    context.favor = tribe?.system?.patronSpirit?.favor || ''
    context.enrichedFavor = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.favor)
    context.ban = tribe?.system?.patronSpirit?.ban || ''
    context.enrichedBan = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.ban)
  }
  if (context.currentActorType === 'spirit') {
    context.manifestation = actorData.manifestation
    context.enrichedManifestation = await foundry.applications.ux.TextEditor.implementation.enrichHTML(actorData.manifestation)
  }

  //
  // --- AQUI ESTÁ A SUA ADIÇÃO ---
  //
  if (context.currentActorType === 'mage') {
    // Usamos 'prepareSpherePowers' para ordenar as Esferas
    context.spheres = await prepareSpherePowers(actorData.spheres)
  }
  // --- FIM DA ADIÇÃO ---

  return context
}

//
// --- SUAS FUNÇÕES ORIGINAIS (INTACTAS E EXPORTADAS) ---
//

export const prepareSpheresContext = async function (context, actor) {
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

export const prepareAreteContext = async function (context, actor) {
  // (O seu código original desta função)
  // ... (a lógica de Arete)
  return context
}'

  // Lógica de Vantagens (Features)
  if (context.currentActorType === 'hunter') {
    context.edges = await prepareEdgePowers(actorData.edges)
  }
  if (context.currentActorType === 'vampire') {
    context.disciplines = await prepareDisciplinePowers(actorData.disciplines)
  }
  if (context.gamesystem === 'werewolf') {
    const tribe = context.tribe
    context.gifts = await prepareGiftPowers(actorData.gifts)
    context.favor = tribe?.system?.patronSpirit?.favor || ''
    context.enrichedFavor = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.favor)
    context.ban = tribe?.system?.patronSpirit?.ban || ''
    context.enrichedBan = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.ban)
  }
  if (context.currentActorType === 'spirit') {
    context.manifestation = actorData.manifestation
    context.enrichedManifestation = await foundry.applications.ux.TextEditor.implementation.enrichHTML(actorData.manifestation)
  }

  //
  // --- AQUI ESTÁ A SUA ADIÇÃO ---
  //
  if (context.currentActorType === 'mage') {
    // Usamos 'prepareSpherePowers' para ordenar as Esferas
    context.spheres = await prepareSpherePowers(actorData.spheres)
  }
  // --- FIM DA ADIÇÃO ---

  return context
}

//
// --- SUAS FUNÇÕES ORIGINAIS (INTACTAS E EXPORTADAS) ---
//

export const prepareSpheresContext = async function (context, actor) {
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

export const prepareAreteContext = async function (context, actor) {
  // (O seu código original desta função)
  // ... (a lógica de Arete)
  return context
}