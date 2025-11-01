// ============================================================
// Mage Sheet Module - Adaptador para WoD5e (Foundry VTT)
// ============================================================

// Importa as Esferas (ajuste o caminho conforme seu projeto)
import { Spheres } from "./api/def/spheres.js";
// Importa a ficha personalizada
import MageActorSheet from "./scripts/actor/mta/mage-actor-sheet.js";

// ============================================================
// HOOK: init
// ============================================================
Hooks.once("init", () => {
  console.log("Mage Sheet Module | Iniciando módulo Mage: The Ascension (WoD5e base)");

  // Inicializa as definições das Esferas
  if (Spheres?._initializeDefinitions) {
    Spheres._initializeDefinitions();
  } else {
    console.warn("Mage Sheet Module | Classe Spheres não encontrada, pulando inicialização de Esferas.");
  }

  // Registro da ficha Mage
  console.log("Mage Sheet Module | Registrando Mage Actor Sheet...");
  Actors.registerSheet("wod5e", MageActorSheet, {
    types: ["character"],
    makeDefault: false,
    label: "Mage: The Ascension Sheet"
  });
});

// ============================================================
// HOOK: ready
// ============================================================
Hooks.once("ready", async () => {
  console.log("Mage Sheet Module | Esperando o sistema WoD5e carregar...");

  // Aguarda até que o WoD5e exponha sua API
  const waitForWoD5E = async () => {
    for (let i = 0; i < 20; i++) {
      if (game?.wod5e?.api) return true;
      await new Promise(r => setTimeout(r, 500));
    }
    return false;
  };

  const wod5eLoaded = await waitForWoD5E();

  if (!wod5eLoaded) {
    console.error("Mage Sheet Module | Não foi possível acessar game.wod5e.api após aguardar.");
    return;
  }

  console.log("Mage Sheet Module | WoD5e detectado, aplicando integração Mage...");
  initializeMageIntegration();
});

// ============================================================
// Mage API Integration
// ============================================================
function initializeMageIntegration() {
  const wodAPI = game?.wod5e?.api;
  if (!wodAPI) {
    console.error("Mage Sheet Module | Não foi possível encontrar game.wod5e.api");
    return;
  }

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
