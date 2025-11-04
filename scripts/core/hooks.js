/* global CONFIG, Hooks, foundry, game, ui, WOD5E, libWrapper */

// =======================================================================
// IMPORTAÇÕES (As suas originais)
// =======================================================================
import { MageActorSheet } from "../../scripts/actor/mta/mage-actor-sheet.js"; 
import { MageParadoxDie, MageRoteDie } from "../../dice/splat-dice-mage.js"; 
import { MageActorTypes } from "../../api/def/mage-actortypes.js"; 
import { Spheres } from "../../api/def/spheres.js";            
import { MageItemTypes } from "../../api/def/mage-itemtypes.js"; 

// Importa a lógica de preparação de dados (verifique os caminhos)
import { prepareSpheres } from "../../scripts/actor/mta/scripts/prepare-data.js";
import { getMageModifiers } from "../../scripts/actor/mta/scripts/mage-bonuses.js";

/* -------------------------------------------- */
/* HOOK: INIT (Esta parte está funcionando 100%) */
/* -------------------------------------------- */
Hooks.once("init", () => {
    console.log('MTA5E | Hooks INIT: Registrando Dados e LibWrapper.');
    
    // 1. REGISTRO DE DADOS CUSTOMIZADOS (Perfeito)
    CONFIG.Dice.terms.p = MageParadoxDie; 
    CONFIG.Dice.terms.r = MageRoteDie;    

    // 2. INJEÇÃO DE LÓGICA (Perfeito)
    libWrapper.register('mage-sheet-module', 'CONFIG.Actor.documentClass.prototype.prepareDerivedData', async function (wrapped, ...args) {
        
        await wrapped.call(this, ...args); 

        try {
            if (this.type === 'mage') {
                this.system.gamesystem = 'mage'; 
                this.system.spheres = await prepareSpheres(this); 
                this.system.bonuses = await getMageModifiers(this.system);
            }
        } catch (e) {
            console.error(e);
        }
    }, 'WRAPPER');

    // 3. INJEÇÃO DE TIPO NO SISTEMA BASE (Perfeito)
    if (CONFIG.Actor.documentClass && !CONFIG.Actor.documentClass.TYPES.includes('mage')) {
        CONFIG.Actor.documentClass.TYPES.push('mage');
    }
});


/* -------------------------------------------- */
/* HOOK: READY (A Nova Lógica "Hardcoded") */
/* -------------------------------------------- */
Hooks.once("ready", async function () {
    console.log('MTA5E | Hooks READY: Registrando Ficha e Injetando Definições no WOD5E.');

    // 1. REGISTRE A FICHA (Corrigindo o Label da Imagem)
    // Vamos usar a string "Mago" diretamente.
    foundry.documents.collections.Actors.registerSheet('vtm5e', MageActorSheet, { 
        types: ['mage'],
        makeDefault: true,
        label: "Mago" // <--- MUDANÇA AQUI
    });
    console.log('MTA5E | Ficha de Mago Registrada.');

    // 2. INJEÇÃO NA API GLOBAL WOD5E (Corrigindo o Label do Console)
    if (window.WOD5E) {
        
        // Pega o objeto não-traduzido do seu arquivo original
        const mageTypes = MageActorTypes.getList({}); // { mage: { label: 'TYPES.Actor.mage' } }

        // *** A MUDANÇA ESTÁ AQUI ***
        // Vamos definir o label e o displayName diretamente
        if (mageTypes.mage) {
            mageTypes.mage.label = "Mago"; // <--- MUDANÇA AQUI
            mageTypes.mage.displayName = "Mago"; // <--- MUDANÇA AQUI
        }
        // *** FIM DA MUDANÇA ***

        // Injeta o objeto AGORA JÁ TRADUZIDO no WOD5E
        foundry.utils.mergeObject(window.WOD5E.ActorTypes, mageTypes);
        
        console.log('MTA5E | Tipo "mage" injetado e traduzido (Hardcoded).');

        // 3. Injeção do resto (Spheres, ItemTypes)
        window.WOD5E.Spheres = Spheres;
        const mageItemTypes = MageItemTypes.getList({});
        foundry.utils.mergeObject(window.WOD5E.ItemTypes, mageItemTypes);
    }
});