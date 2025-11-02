// Importa a classe da sua ficha de Mago (o caminho vem do seu module.json)
import { MageActorSheet } from '../actor/mta/mage-actor-sheet.js'

/* -------------------------------------------- */
/* HOOK: INIT (INJEÇÃO DE DADOS)               */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  console.log('Mage: The Ascension 5e | Inicializando dados customizados.')

  // 1. Definir os dados que vamos injetar (BASEADO NA SUA ESTRUTURA)
  const mageDataInjection = {
    // Flag para sabermos que este mortal é um Mago
    isMage: false,

    // Traços de Mago
    // (Ajustei 'arete.potency' para 'arete.value' para seguir o padrão do vtm5e)
    arete: {
      value: 1,
      max: 10
    },
    paradox: {
      value: 0,
      max: 10
    },
    quintessence: {
      value: 0,
      max: 10
    },
    wisdom: {
      value: 7,
      stains: 0
    },
    frenzyActive: false, // Para o Backlash do Paradoxo

    // Esferas (Exatamente como você definiu, com 9 esferas)
    spheres: {
      correspondence: { value: 0, powers: [], visible: false },
      entropy: { value: 0, powers: [], visible: false },
      forces: { value: 0, powers: [], visible: false },
      life: { value: 0, powers: [], visible: false },
      matter: { value: 0, powers: [], visible: false },
      mind: { value: 0, powers: [], visible: false },
      prime: { value: 0, powers: [], visible: false },
      spirit: { value: 0, powers: [], visible: false },
      time: { value: 0, powers: [], visible: false }
    }
  }

  // 2. Injetar os dados no template do Ator 'mortal' do sistema vtm5e
  mergeObject(game.system.template.Actor.mortal, mageDataInjection)

  // 3. Definir novos tipos de Itens
  const itemTemplate = game.system.template.Item

  // Novo tipo 'rote' (clonado de 'power')
  itemTemplate.types.push('rote')
  itemTemplate.rote = foundry.utils.deepClone(itemTemplate.power)
  mergeObject(itemTemplate.rote, {
    gamesystem: 'mage',
    arcana: '', // Campo customizado para a Arcana principal
    paradoxCost: 0
  })
  CONFIG.Item.typeLabels.rote = 'MTA.Rote' // Label de tradução

  // Novo tipo 'focus' (clonado de 'feature')
  itemTemplate.types.push('focus')
  itemTemplate.focus = foundry.utils.deepClone(itemTemplate.feature)
  mergeObject(itemTemplate.focus, {
    gamesystem: 'mage',
    featuretype: 'focus'
  })
  CONFIG.Item.typeLabels.focus = 'MTA.Focus'
})

/* -------------------------------------------- */
/* HOOK: READY (SUBSTITUIÇÃO DA FICHA)         */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
  console.log('Mage: The Ascension 5e | Registrando folha de personagem customizada.')

  // Desregistra a folha de Mortal padrão do sistema vtm5e
  Actors.unregisterSheet('vtm5e', 'MortalActorSheet')

  // Registra a SUA folha de Mago (MageActorSheet) como a nova folha padrão para o tipo 'mortal'
  Actors.registerSheet('vtm5e', MageActorSheet, {
    types: ['mortal'], // Aplica-se apenas ao tipo 'mortal'
    makeDefault: true,
    label: 'MTA.SheetTitle' // Label de tradução
  })
})