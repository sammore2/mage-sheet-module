// ============================================================
// Mage Sheet Module - Adaptador para WoD5e (Foundry VTT)
// ============================================================

// Importa as Esferas (caminho relativo)
import { Spheres } from "./api/def/spheres.js";

// Importa a ficha personalizada (caminho relativo e sintaxe correta)
import { MageActorSheet } from "./scripts/actor/mta/mage-actor-sheet.js";

// Importa a nova definição de tipo de ator
import { MageActorType } from "./api/def/mage-actortypes.js"; 

// ============================================================
// HOOK: init (Apenas inicialização de dados)
// ============================================================
Hooks.once("init", () => {
  console.log("Mage Sheet Module | Iniciando módulo Mage: The Ascension (WoD5e base)");

  // Inicializa as definições das Esferas
  if (Spheres?._initializeDefinitions) {
    Spheres._initializeDefinitions();
  } else {
    console.warn("Mage Sheet Module | Classe Spheres não encontrada, pulando inicialização de Esferas.");
  }
});

// ============================================================
// HOOK: setup (Registro de Fichas)
// ============================================================
Hooks.once("setup", () => {
  console.log("Mage Sheet Module | Registrando Mage Actor Sheet...");

  // Registro da ficha com o ID do sistema (vtm5e) e o tipo de ator (mage) corretos.
  foundry.documents.collections.Actors.registerSheet("vtm5e", MageActorSheet, { 
    types: ["mage"], // Tipo de ator: 'mage'
    makeDefault: true, 
    label: "Mage: The Ascension Sheet"
  });
});

// ============================================================
// HOOK: ready (Injeção na lista do sistema WoD5e e Correção de UI)
// ============================================================
Hooks.once("ready", async () => {
  console.log("Mage Sheet Module | Recarregamento completo do jogo concluído.");
  
  // SOLUÇÃO ESTRUTURAL DE VISIBILIDADE: Injetar o tipo 'mage' na lista ActorTypes.
  if (window.WOD5E && window.WOD5E.ActorTypes) {
      
      // Itera sobre a nova definição e insere cada tipo ('mage') na lista do sistema.
      for (const [key, value] of Object.entries(MageActorType)) {
          if (!window.WOD5E.ActorTypes[key]) {
              window.WOD5E.ActorTypes[key] = value;
              console.log(`Mage Sheet Module | Tipo de ator '${key}' injetado na lista ActorTypes do sistema.`);
          }
      }

      // Correção da UI: Chamamos o render(true) para forçar o redesenho.
      ui.actors.render(true);
      console.log("Mage Sheet Module | Forçada a re-renderização da interface de Atores. Mago deve estar visível.");
  }
  
  // Inicialização da API (executa a lógica principal se a API existir)
  initializeMageIntegration();
});

// ============================================================
// Mage API Integration (Seu código original, agora sem o erro de console)
// ============================================================
function initializeMageIntegration() {
  const wodAPI = game?.wod5e?.api;
  if (!wodAPI) {
    console.error("Mage Sheet Module | game.wod5e.api não encontrada. Ignorando a integração da API.");
    return;
  }

  console.log("Mage Sheet Module | WoD5e detectado, aplicando integração Mage...");

  // Cria namespace para Mage na API do WoD5e
  wodAPI.mage = {
    spheres: Spheres.definitions,
    registerMageActor,
    getMageActors,
  };

  console.log("Mage Sheet Module | API Mage conectada:", wodAPI.mage);
}

// Retorna todos os personagens Mage
function getMageActors() {
  return game.actors?.filter(a => a.system?.type === "mage");
}

// Função de registro simples (futuro: pode aplicar efeitos ou Esferas específicas)
function registerMageActor(actor) {
  console.log("Mage Sheet Module | Registrando ator Mage:", actor.name);
  // Espaço reservado para lógica futura
}