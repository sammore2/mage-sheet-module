// Dados para injetar no Ator 'mortal'
export const mageDataInjection = {
  isMage: false,
  arete: { value: 1, max: 10 },
  paradox: { value: 0, max: 10 },
  quintessence: { value: 0, max: 10 },
  wisdom: { value: 7, stains: 0 },
  frenzyActive: false,
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
};

// Dados para injetar nos Itens
export const itemData = {
  rote: {
    gamesystem: 'mage',
    arcana: '',
    paradoxCost: 0
  },
  focus: {
    gamesystem: 'mage',
    featuretype: 'focus'
  }
};