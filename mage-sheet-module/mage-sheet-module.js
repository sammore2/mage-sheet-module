/* global game */

// Importa a sua classe da ficha (do caminho correto)
import { MageActorSheet } from './scripts/actor/mta/mage-actor-sheet.js'

// Importa a nossa definição de Esferas (o nosso "def")
import { Spheres } from './api/def/spheres.js'

// --- O HOOK DE INICIALIZAÇÃO ---
// (Como vimos no main.js, 'init' é o momento certo)
Hooks.on('init', async function () {
  console.log('Mage Sheet Module | Iniciando Módulo de Mago')

  // 1. REGISTRA A FICHA DE ATOR
  Actors.registerSheet('wod5e', MageActorSheet, {
    types: ['mage'], 
    makeDefault: true,
    label: 'WOD5E.MTA.MageSheet' // (Precisamos adicionar esta chave de tradução)
  })

  // 2. INJETA A NOSSA API DE ESFERAS
  // (Como o main.js faz com Disciplines, Gifts, etc.)
  game.wod5e.api = game.wod5e.api || {}
  game.wod5e.api.Spheres = Spheres
  console.log('Mage Sheet Module | API de Esferas injetada em game.wod5e.api.Spheres')

  // 3. APLICA OS "MONKEY-PATCHES"
  // (Para forçar o sistema "hardcoded" a nos reconhecer)

  // --- PATCH 1: Para o 'dicepool-list.js' ---
  // (Adiciona Esferas na lista de Paradas de Dados dos Itens)
  
  // Guarda uma cópia da função original
  const originalGetDicepoolList = game.wod5e.api.getDicepoolList
  
  // Substitui a função do sistema pela nossa
  game.wod5e.api.getDicepoolList = async (document) => {
    // 1. Chama a função original (para puxar Atributos, Perícias, Disciplinas, etc.)
    const masterList = await originalGetDicepoolList(document)

    // 2. Adiciona as nossas Esferas do nosso 'def'
    const spheres = game.wod5e.api.Spheres.getList({})
    for (const [key, value] of Object.entries(spheres)) {
      masterList.push({
        value: `spheres.${key}`, // O caminho (ex: 'spheres.prime')
        label: value.name,       // O nome (ex: "Prima")
        group: game.i18n.localize('WOD5E.MTA.Spheres') // (Nova chave de tradução)
      })
    }
    
    // 3. Retorna a lista modificada
    return masterList
  }

  // --- PATCH 2: Para o 'get-selectors-list.js' ---
  // (Adiciona Esferas e Stats de Mago na lista de Modificadores das Vantagens)

  // Guarda uma cópia da função original
  const originalGetSelectorsList = game.wod5e.api.getSelectorsList

  // Substitui a função do sistema
  game.wod5e.api.getSelectorsList = () => {
    // 1. Chama a função original
    const selectorsList = originalGetSelectorsList()

    // 2. Adiciona as nossas Esferas (copiando o padrão das Disciplinas)
    const spheres = game.wod5e.api.Spheres.getList({})
    // Adiciona o grupo "Todas as Esferas"
    selectorsList.push({
      id: 'spheres',
      displayName: game.i18n.format('WOD5E.Modifier.AllString', {
        string: game.i18n.localize('WOD5E.MTA.Spheres')
      })
    })
    // Adiciona cada Esfera individual
    for (const [key, value] of Object.entries(spheres)) {
      selectorsList.push({
        id: key, // (O 'id' é só 'prime', 'forces', etc.)
        displayName: value.name
      })
    }

    // 3. Adiciona as nossas Stats de Mago (copiando o padrão de Humanity, Rage, etc.)
    selectorsList.push({
      id: 'arete',
      displayName: game.i18n.localize('WOD5E.MTA.Arete')
    })
    selectorsList.push({
      id: 'paradox',
      displayName: game.i18n.localize('WOD5E.MTA.Paradox')
    })
    selectorsList.push({
      id: 'quintessence',
      displayName: game.i18n.localize('WOD5E.MTA.Quintessence')
    })
    selectorsList.push({
      id: 'wisdom',
      displayName: game.i18n.localize('WOD5E.MTA.Wisdom')
    })

    // 4. Retorna a lista modificada
    return selectorsList
  }

  // --- PATCH 3: Para o 'generate-localization.js' ---
  // (Ensina o sistema a traduzir 'spheres.prime' para "Prima")

  // Guarda uma cópia da função original
  const originalGenerateLocalizedLabel = game.wod5e.api.generateLocalizedLabel

  // Substitui a função do sistema
  game.wod5e.api.generateLocalizedLabel = function (string = '', type = '') {
    // 1. Intercepta se for do tipo 'spheres'
    if (type === 'spheres' || type === 'sphere') {
      const spheres = game.wod5e.api.Spheres.getList({})
      // Retorna o nome da nossa 'def' ou a string original
      return spheres[string]?.name || string
    } 
    // 2. Se não for, chama a função original
    else {
      return originalGenerateLocalizedLabel(string, type)
    }
  }

  console.log('Mage Sheet Module | Patches de API aplicados com sucesso.')
})