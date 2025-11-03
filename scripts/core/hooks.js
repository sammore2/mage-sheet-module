/* -------------------------------------------- */
/* Importações Necessárias (Síncrono)           */
/* -------------------------------------------- */

import { MageActor } from "../actor/mta/mage-actor.js";
import { MageActorSheet } from "../actor/mta/mage-actor-sheet.js"; 


/* -------------------------------------------- */
/* HOOK: INIT (1. Registro de Classes & Validação CORE) */
/* -------------------------------------------- */

Hooks.once("init", () => {
    // 1. REGISTRO DE CLASSE DE DOCUMENTO: Diz ao Foundry para usar a nossa classe MageActor.
    CONFIG.Actor.documentClass = MageActor;
    
    // 2. INJEÇÃO CRÍTICA DE TIPO CORE: (Resolve o DataModelValidationError)
    const WoDActorClass = CONFIG.Actor.documentClass;
    if (!WoDActorClass.TYPES.includes('mage')) {
        WoDActorClass.TYPES.push('mage');
    }
    
    // 3. REGISTRO DE FICHA NO FOUNDRY CORE:
    foundry.documents.collections.Actors.registerSheet('mage-sheet-module', MageActorSheet, {
        types: ['mage'],
        makeDefault: true,
        label: 'WOD5E.MTA.MageSheet'
    });
});


/* -------------------------------------------- */
/* HOOK: LIBWRAPPER (2. Contorno Definitivo do Erro) */
/* -------------------------------------------- */

// Resolve o DataModelValidationError para o tipo 'mage' permanentemente.
Hooks.once("libWrapper.ready", () => {
    if (typeof libWrapper !== 'undefined') {
        // Envolve o método de validação da sua classe MageActor
        libWrapper.register('mage-sheet-module', 'MageActor.prototype.validate', function (wrapped, options) {
            // Se o tipo for 'mage', IGNORA O SUPER e devolve TRUE.
            if (this.type === 'mage') {
                return true;
            }
            // Para todos os outros tipos, roda a validação original.
            return wrapped(options);
        }, 'WRAP');
    }
});


/* -------------------------------------------- */
/* HOOK: READY (3. O Bloco de Injeção que VOCÊ sabe que funciona) */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  console.log('Mage: Hook READY iniciado. Injetando ActorType e Template.');

  // 1. Injetar tipo "mage" (O SEU CÓDIGO)
  const MageActorType = {
    mage: {
      label: 'WOD5E.MTA.Actor.Mage', // Padronizado para WOD5E.MTA
      templates: ['mortal'], // Herda do Mortal para ter os dados WoD base
      power: 'arete'
    }
  };

  if (WOD5E && WOD5E.ActorTypes) {
    Object.assign(WOD5E.ActorTypes, MageActorType);
    console.log('Mage: Tipo "mage" injetado em WOD5E.ActorTypes.');
  }

  // 2. Template de dados
  const mageTemplateData = {
    isMage: true,
    arete: { value: 1, max: 10 },
    paradox: { value: 0, max: 10 },
    quintessence: { value: 0, max: 10 },
    wisdom: { value: 7, stains: 0 },
    frenzyActive: false,
    spheres: {
      correspondence: { value: 0, powers: [], visible: false },
      // ... (todas as esferas)
    },
    system: { settings: { skillAttributeInputs: false } }
  };

  if (WOD5E.ActorTypes.mortal) { // Clona do mortal, que agora existe no ready
    WOD5E.ActorTypes.mage = foundry.utils.mergeObject(
      foundry.utils.deepClone(WOD5E.ActorTypes.mortal),
      mageTemplateData
    );
    console.log('Mage: Template de dados aplicado no READY.');
  }

  // 3. Forçar o re-render para mostrar "Mage" no menu de criação
  if (game.actors) {
      game.actors.render(true);
  }
});