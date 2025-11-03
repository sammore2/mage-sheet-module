/* -------------------------------------------- */
/* HOOK: READY (A Solução Correta de Timing)    */
/* -------------------------------------------- */

// Nós esperamos o 'ready' porque ele garante que o
// hook 'init' do sistema vtm5e (wod5e) já terminou.
Hooks.once('ready', async function () {
  console.log('Mage: The Ascension 5e | 1. Hook READY. Iniciando "core".');

  // --- 1. Injetando o Tipo de Ator "mage" ---
  const MageActorType = {
    mage: {
      label: 'MTA.Actor.Mage', //
      templates: ['mortal'],
      power: 'arete'
    }
  };

  // Agora, no 'ready', o WOD5E VAI existir.
  // Esta condicional (que antes dava erro) vai funcionar.
  if (WOD5E && WOD5E.ActorTypes) {
    Object.assign(WOD5E.ActorTypes, MageActorType);
    console.log('Mage: The Ascension 5e | SUCESSO: Tipo "mage" injetado em WOD5E.ActorTypes.');
  } else {
    console.error('Mage: The Ascension 5e | FALHA: Objeto global WOD5E.ActorTypes não encontrado (mesmo no hook "ready")!');
    return;
  }

  // --- 2. Injetando o Template de Dados do "mage" ---
  // (Dados do seu template.json)
  const mageTemplateData = {
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
  }; //

  // O 'CONFIG' (para dados de template) também está pronto no 'ready'
  if (WOD5E && WOD5E.ActorTypes && WOD5E.ActorTypes.mage) {
    WOD5E.ActorTypes.mage = foundry.utils.mergeObject(
      foundry.utils.deepClone(WOD5E.ActorTypes.mortal), 
      mageTemplateData
    );
    console.log('Mage: The Ascension 5e | SUCESSO: Template de dados "mage" injetado em CONFIG.wod5e.template.Actor.');
  } else {
     console.error('Mage: The Ascension 5e | FALHA: CONFIG.wod5e.template.Actor não encontrado!');
     return;
  }

  // --- 3. Importando e Registrando a Ficha ---
  // (Presumindo que você corrigiu o 'mage-roll.js' e o 'mage-actor-sheet.js'
  // para usar os caminhos corretos que você encontrou, como WOD5E.Roll)
  try {
    // Importamos os arquivos dinamicamente
    const { MageActorSheet } = await import('../actor/mta/mage-actor-sheet.js'); //

// NOVO (hooks.js, linha 70)
foundry.documents.collections.Actors.registerSheet('vtm5e', MageActorSheet, {
      types: ['mage'], // Registra para o nosso novo tipo 'mage'
      makeDefault: true,
      label: 'MTA.Sheet.Label' // (Use sua chave de tradução)
    });

    console.log('Mage: The Ascension 5e | SUCESSO: Ficha personalizada registrada para o tipo "mage".');
    console.log('Mage: The Ascension 5e | PLANO "DO ZERO" CONCLUÍDO.');
    
  } catch (error) {
    console.error('Mage: The Ascension 5e | FALHA CRÍTICA ao importar dinamicamente a MageActorSheet. Verifique se os imports em "mage-actor-sheet.js" e "mage-roll.js" estão corretos.', error);
  }
});