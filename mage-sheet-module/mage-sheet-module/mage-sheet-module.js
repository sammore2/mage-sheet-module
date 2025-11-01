/* global game, Actors, Hooks, WoDActor, loadTemplates */

// Importa a sua classe da ficha
import { MageActorSheet } from './scripts/actor/mta/mage-actor-sheet.js'

// Importa a nossa definição de Esferas (o nosso "def")
import { Spheres } from './api/def/spheres.js'

// Importa a função de preparação de dados
// (Como corrigimos, importando 'prepareSpheres' do seu 'prepare-data.js')
import { prepareSpheres } from './scripts/actor/mta/scripts/prepare-data.js'

// 
// --- 1. FUNÇÃO DE PRÉ-CARREGAMENTO DE HBS (A SUA OBSERVAÇÃO) ---
// (Como o sistema faz no main.js)
//
async function preloadHandlebarsTemplates () {
  const templatePaths = [
    // A ficha principal
    'modules/mage-sheet-module/templates/actors/mage-sheet.hbs',

    // As "partes" (abas) da ficha que você criou
    'modules/mage-sheet-module/templates/actors/parts/arete.hbs',
    'modules/mage-sheet-module/templates/actors/parts/paradox.hbs',
    'modules/mage-sheet-module/templates/actors/parts/spheres.hbs'
    
    // (Se você tiver outras abas customizadas, adicione os paths delas aqui)
  ]
  return loadTemplates(templatePaths)
}

// --- O HOOK DE INICIALIZAÇÃO ---
// (Aqui fazemos apenas o que é essencial e seguro)
Hooks.on('init', async function () {
  console.log('Mage Sheet Module | Iniciando Módulo de Mago (Fase Init)')

  // 0. INICIALIZA A NOSSA API DE ESFERAS
  // (Isso é seguro, pois é o nosso próprio código)
  Spheres._initializeDefinitions()

  // 1. REGISTRA A FICHA DE ATOR
  // (Deve ser feito no 'init')
  Actors.registerSheet('wod5e', MageActorSheet, {
    types: ['mage'],
    makeDefault: true,
    label: 'WOD5E.MTA.MageSheet'
  })

  // 
  // --- 2. CHAMADA DE PRÉ-CARREGAMENTO DE HBS (A SUA OBSERVAÇÃO) ---
  // (Chamamos a função definida acima)
  //
  preloadHandlebarsTemplates()

  // 3. APLICA O PATCH DO ATOR (PATCH 4)
  // (Isso é seguro, pois 'WoDActor' está disponível no 'init')
  const originalPrepareData = WoDActor.prototype._prepareData
  WoDActor.prototype._prepareData = async function () {
    // 1. Chama o original
    await originalPrepareData.call(this)

    // 2. Se for 'mage', chama a nossa preparação
    if (this.type === 'mage') {
      // 'prepareSpheres' é a função que você exportou
      // de 'prepare-data.js'
      await prepareSpheres(this)
    }
  }

  console.log('Mage Sheet Module | Fase Init Concluída.')
})

// --- O HOOK DE PRONTO ---
// (Aqui fazemos os patches na API do sistema, pois AGORA
// temos certeza que 'game.wod5e.api' existe e não dá erro)
Hooks.on('ready', function () {
  console.log('Mage Sheet Module | Aplicando Patches da API (Fase Ready)')

  // 0. INJETA A NOSSA API DE ESFERAS
  // (Para que os patches e o 'prepare-data' possam usá-la)
  game.wod5e.api.Spheres = Spheres

  // --- PATCH 1: Para o 'dicepool-list.js' ---
  const originalGetDicepoolList = game.wod5e.api.getDicepoolList
  game.wod5e.api.getDicepoolList = async (document) => {
    const masterList = await originalGetDicepoolList(document)
    // Usamos nossa API que acabamos de injetar
    const spheres = game.wod5e.api.Spheres.getList({}) 
    for (const [key, value] of Object.entries(spheres)) {
      masterList.push({
        value: `spheres.${key}`,
        label: value.name,
        group: game.i18n.localize('WOD5E.MTA.Spheres')
      })
    }
    return masterList
  }

  // --- PATCH 2: Para o 'get-selectors-list.js' ---
  const originalGetSelectorsList = game.wod5e.api.getSelectorsList
  game.wod5e.api.getSelectorsList = () => {
    const selectorsList = originalGetSelectorsList()
    const spheres = game.wod5e.api.Spheres.getList({})
    selectorsList.push({
      id: 'spheres',
      displayName: game.i18n.format('WOD5E.Modifier.AllString', {
        string: game.i18n.localize('WOD5E.MTA.Spheres')
      })
    })
    for (const [key, value] of Object.entries(spheres)) {
      selectorsList.push({
        id: key,
        displayName: value.name
      })
    }
    selectorsList.push({ id: 'arete', displayName: game.i18n.localize('WOD5E.MTA.Arete') })
    selectorsList.push({ id: 'paradox', displayName: game.i18n.localize('WOD5E.MTA.Paradox') })
    selectorsList.push({ id: 'quintessence', displayName: game.i18n.localize('WOD5E.MTA.Quintessence') })
    selectorsList.push({ id: 'wisdom', displayName: game.i18n.localize('WOD5E.MTA.Wisdom') })
    return selectorsList
  }

  // --- PATCH 3: Para o 'generate-localization.js' ---
  const originalGenerateLocalizedLabel = game.wod5e.api.generateLocalizedLabel
  game.wod5e.api.generateLocalizedLabel = function (string = '', type = '') {
    if (type === 'spheres' || type === 'sphere') {
      const spheres = game.wod5e.api.Spheres.getList({}) 
      return spheres[string]?.name || string
    } else {
      return originalGenerateLocalizedLabel(string, type)
    }
  }

  console.log('Mage Sheet Module | Patches da API aplicados com sucesso.')
})

// Adiciona uma classe ao body da ficha do Mago para o CSS
Hooks.on('renderActorSheet', (app, html) => {
  if (app.actor.type === 'mage') {
    const $html = html[0]
    $html.classList.add('mage-sheet')
  }
})