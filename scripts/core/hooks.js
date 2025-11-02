// Importa as definições de dados (isso é seguro, não depende do Foundry)
import { mageDataInjection, itemData } from './data-injection.js'

// 1. Hook 'init': Usado para carregar os scripts das classes
Hooks.once('init', async function () {
  console.log('Mage: The Ascension 5e | 1. Hook INIT. Carregando classes...');

  try {
    // 2. IMPORTAÇÃO DINÂMICA:
    // Isso espera o 'init' e SÓ ENTÃO carrega os arquivos.
    // Agora, quando mage-roll.js rodar, 'game.vtm5e' VAI existir.
    
    // Carrega as classes de Rolagem
    const { MageRoll, MageRollDialog } = await import('../actor/mta/scripts/mage-roll.js');
    
    // Carrega a classe da Ficha
    const { MageActorSheet } = await import('../actor/mta/mage-actor-sheet.js');

    // 3. REGISTRO DA FICHA:
    // Agora que as classes foram carregadas com segurança, podemos registrar a ficha.
    Actors.unregisterSheet('vtm5e', 'MortalActorSheet'); // Desregistra a ficha de mortal padrão
    Actors.registerSheet('vtm5e', MageActorSheet, {
      types: ['mortal'], // Registra sua ficha para o tipo 'mortal'
      makeDefault: true,
      label: 'MTA.SheetTitle' // (Use a sua chave de tradução)
    });
    
    console.log('Mage: The Ascension 5e | 2. Classes e Ficha registradas.');

  } catch (error) {
    console.error('Mage: The Ascension 5e | Falha ao carregar classes no hook INIT.', error);
  }
});

// 3. Hook 'ready': Usado para injetar dados no CONFIG (que só existe no 'ready')
Hooks.once('ready', async function () {
  console.log('Mage: The Ascension 5e | 3. Hook READY. Injetando dados...');

  // O sistema 'vtm5e' usa o namespace 'wod5e' no CONFIG
  const actorTemplate = CONFIG.wod5e?.template?.Actor;
  const itemTemplate = CONFIG.wod5e?.template?.Item;

  if (!actorTemplate || !itemTemplate) {
    console.error("Mage: The Ascension 5e | ERRO CRÍTICO: Não foi possível encontrar CONFIG.wod5e.template.");
    return;
  }

  // Injeta os dados de Mago no template "mortal"
  foundry.utils.mergeObject(actorTemplate.mortal, mageDataInjection);

  // Injeta os tipos de item (Rote, Focus)
  itemTemplate.types.push('rote');
  itemTemplate.rote = foundry.utils.deepClone(itemTemplate.power);
  foundry.utils.mergeObject(itemTemplate.rote, itemData.rote);
  CONFIG.Item.typeLabels.rote = 'MTA.Rote';

  itemTemplate.types.push('focus');
  itemTemplate.focus = foundry.utils.deepClone(itemTemplate.feature);
  foundry.utils.mergeObject(itemTemplate.focus, itemData.focus);
  CONFIG.Item.typeLabels.focus = 'MTA.Focus';

  console.log('Mage: The Ascension 5e | 4. Injeção de dados completa. Módulo pronto!');
});