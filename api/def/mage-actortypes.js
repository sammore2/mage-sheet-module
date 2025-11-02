// Arquivo a ser salvo em: mage-sheet-module/api/def/mage-actortypes.js

import { MageActorSheet } from "../../scripts/actor/mta/mage-actor-sheet.js"; 

export const MageActorType = {
    // Definimos a estrutura que o sistema WoD5e espera
    mage: {
        label: 'WOD5E.Mage', // Chave de tradução
        types: ['mage'],
        sheetClass: MageActorSheet
    }
};