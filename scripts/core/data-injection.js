/* global Hooks, game */

// Este Hook é um bypass de segurança que garante que a chave de tradução crítica
// seja injetada se o module.json falhar, abrangendo PT-BR e EN-US.

Hooks.once('init', () => {
    // Array com os códigos de idioma mais comuns para PT e EN
    const langCodesToFix = ['pt-BR', 'pt', 'en-US', 'en'];
    
    langCodesToFix.forEach(code => {
        if (game.i18n.translations[code]) {
            let translations = game.i18n.translations[code];
            
            // Define o texto da tradução com base no código do idioma
            let translationText = (code.includes('pt')) ? "Mago" : "Mage"; 

            // 1. Garante que a estrutura TYPES.Actor exista antes de injetar
            if (!translations.TYPES) translations.TYPES = {};
            if (!translations.TYPES.Actor) translations.TYPES.Actor = {};

            // 2. FORÇA A INJEÇÃO DA TRADUÇÃO
            // Isso corrige o problema do label 'TYPES.Actor.mage'
            translations.TYPES.Actor.mage = translationText; 
            
            console.log(`MTA5E | Localização de Tipo de Ator Mago injetada manualmente para ${code}: ${translationText}.`);
        }
    });
});