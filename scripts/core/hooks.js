// Importa a classe da sua ficha de Mago
import { MageActorSheet } from '../actor/mta/mage-actor-sheet.js'

// --- 1. HOOK 'INIT': INJEÇÃO DE DADOS (template.json) ---
Hooks.once('init', async function () {
  console.log('Mage: The Ascension 5e | Inicializando dados customizados.')

  // Estes são os dados que vamos injetar no Ator 'mortal'
  // Baseado no seu trabalho anterior em template.json e spheres.js
  const mageDataInjection = {
    // Flag para sabermos que este mortal é um Mago
    isMage: false,

    // Traços de Mago
    mage_traits: {
      arete: { value: 1, max: 10 }, // Ajustado para 10, mas pode ser 5 se preferir
      paradox: { value: 0, max: 10 },
      wisdom: { value: 7, stains: 0 },
      headers: {
        tradition: '',
        focus: '',
        cabal: ''
      }
    },

    // Arcana (Esferas)
    spheres: {
      coordenacao: { value: 0, powers: [], visible: false },
      correspondencia: { value: 0, powers: [], visible: false },
      entropia: { value: 0, powers: [], visible: false },
      forcas: { value: 0, powers: [], visible: false },
      vida: { value: 0, powers: [], visible: false },
      materia: { value: 0, powers: [], visible: false },
      mente: { value: 0, powers: [], visible: false },
      primeiro: { value: 0, powers: [], visible: false },
      espirito: { value: 0, powers: [], visible: false },
      tempo: { value: 0, powers: [], visible: false }
    }
  }

  // INJEÇÃO: Adiciona os novos dados ao template do Ator 'mortal' do sistema vtm5e
  // Usamos game.system.template, pois CONFIG ainda pode não estar pronto
  mergeObject(game.system.template.Actor.mortal, mageDataInjection)

  // --- Configuração de Itens (Rote / Focus) ---
  // Vamos clonar o tipo 'power' (de Disciplinas) para criar 'rote' (Feitiço)
  // E clonar 'feature' para 'focus'
  const itemTemplate = game.system.template.Item

  // Novo tipo 'rote'
  itemTemplate.types.push('rote')
  itemTemplate.rote = foundry.utils.deepClone(itemTemplate.power)
  mergeObject(itemTemplate.rote, {
    gamesystem: 'mage',
    arcana: '', // Campo customizado para a Arcana principal
    paradoxCost: 0
  })
  CONFIG.Item.typeLabels.rote = 'MTA.Rote' // Label de tradução

  // Novo tipo 'focus'
  itemTemplate.types.push('focus')
  itemTemplate.focus = foundry.utils.deepClone(itemTemplate.feature)
  mergeObject(itemTemplate.focus, {
    gamesystem: 'mage',
    featuretype: 'focus'
  })
  CONFIG.Item.typeLabels.focus = 'MTA.Focus' // Label de tradução
})

// --- 2. HOOK 'READY': REGISTRO DA FOLHA CUSTOMIZADA ---
Hooks.once('ready', async function () {
  console.log('Mage: The Ascension 5e | Registrando folha de personagem customizada.')

  // Desregistra a folha de Mortal padrão do sistema vtm5e
  Actors.unregisterSheet('vtm5e', 'MortalActorSheet')

  // Registra a SUA folha de Mago (MageActorSheet) como a nova folha para o tipo 'mortal'
  Actors.registerSheet('vtm5e', MageActorSheet, {
    types: ['mortal'], // Aplica-se apenas ao tipo 'mortal'
    makeDefault: true,
    label: 'MTA.SheetTitle' // Label de tradução
  })
})