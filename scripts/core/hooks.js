/* global CONFIG, Hooks, foundry, game, ui, WOD5E */

// =======================================================================
// IMPORTAÇÕES (Clonando a Estrutura do Main.js)
// =======================================================================

// CLASSES DE ATOR/SHEET (Do seu módulo)
import { MageActor } from "../../scripts/actor/mta/mage-actor.js"; // Sua Classe de Ator (Estende WoDActorBase)
import { MageActorSheet } from "../../scripts/actor/mta/mage-actor-sheet.js"; 

// CLASSES DE DADOS (Você deve criá-las)
import { MageParadoxDie, MageRoteDie } from "../../dice/splat-dice-mage.js"; 

// ARQUIVOS DE DEFINIÇÃO (Do seu módulo, estendem BaseDefinitionClass)
import { MageActorTypes } from "../../api/def/mage-actortypes.js"; 
import { Spheres } from "../../api/def/spheres.js";            
import { MageItemTypes } from "../../api/def/mage-itemtypes.js"; 


/* -------------------------------------------- */
/* HOOK: INIT (Clonando o Registro de Classes e Dados do Sistema) */
/* -------------------------------------------- */

Hooks.once("init", () => {
    console.log('MTA5E | Hooks INIT: Iniciando Registro de Classes e Dados de Mago.');
    
    // 1. REGISTRO DE CLASSE DE DOCUMENTO (Entidade Principal)
    // Se você tem uma classe MageActor customizada, registre-a.
    CONFIG.Actor.documentClass = MageActor; // Sobrescreve para usar a sua classe
    
    // 2. REGISTRO DE DADOS CUSTOMIZADOS (Paralelo ao MortalDie, VampireDie, etc.)
    // O sistema usa letras minúsculas para dados customizados. Usaremos 'p' para Paradox.
    CONFIG.Dice.terms.p = MageParadoxDie; // Dado de Risco (Paradoxo)
    CONFIG.Dice.terms.r = MageRoteDie;    // Dado de Força (Rotina/Arete)
    
    // 3. REGISTRO DA FICHA NO FOUNDRY CORE (Paralelo ao WoD5EActorDirectory)
    // Isso deve ser feito aqui para que o tipo 'mage' apareça na criação de ator.
    foundry.documents.collections.Actors.registerSheet('mage-sheet-module', MageActorSheet, {
        types: ['mage'],
        makeDefault: true,
        label: 'TYPES.Actor.mage' // Usa a chave de tradução do seu lang.
    });

    // 4. INJEÇÃO CRÍTICA DE TIPO CORE (Garante que WoDActor aceite 'mage')
    // A lista TYPES do WoDActor precisa ser complementada AQUI.
    if (!CONFIG.Actor.documentClass.TYPES.includes('mage')) {
        CONFIG.Actor.documentClass.TYPES.push('mage');
    }
});


/* -------------------------------------------- */
/* HOOK: READY (Clonando a Injeção na API Global WOD5E) */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
    console.log('MTA5E | Hooks READY: Injetando Definições MTA5E no objeto WOD5E global.');

    if (window.WOD5E) {
        
        // 1. INJEÇÃO DE ACTORTYPES (O bloco que você sabe que funciona)
        // Isso injeta o tipo 'mage' na lista ActorTypes que o sistema consome.
        const mageTypes = MageActorTypes.getList({});
        foundry.utils.mergeObject(window.WOD5E.ActorTypes, mageTypes);
        console.log('MTA5E | Tipo "mage" injetado em WOD5E.ActorTypes.');

        
        // 2. INJEÇÃO DE NOVAS DEFINIÇÕES (Paralelo a Disciplines, Gifts, etc.)
        // As Esferas são a nova Disciplina do Mago.
        window.WOD5E.Spheres = Spheres;
        console.log('MTA5E | Definições de Esferas injetadas em WOD5E.Spheres.');
        
        // 3. INJEÇÃO DE NOVOS ITEMTYPES (Rotina, Foco, etc.)
        const mageItemTypes = MageItemTypes.getList({});
        foundry.utils.mergeObject(window.WOD5E.ItemTypes, mageItemTypes);
        console.log('MTA5E | Novos ItemTypes injetados em WOD5E.ItemTypes.');
    }
});