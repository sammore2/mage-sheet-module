// scripts/actor/mta/mage-actor.js

// Importa a classe base do sistema WoD5E (WoDActor)
import { WoDActor } from "/systems/vtm5e/system/actor/actor.js";
import { prepareSpheres } from './scripts/prepare-data.js'
import { getMageModifiers } from './scripts/mage-bonuses.js'
import { Spheres } from '../../../api/def/spheres.js'

// scripts/actor/mta/mage-actor.js
  

export class MageActor extends WoDActor {
  /**
   * @override
   * Complementa o prepareDerivedData do WoDActor.
   */
  async prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
	
	const typeMapping = {
	  mage: 'mage'
    }

    // --- 1. LÓGICA DE TIPO CUSTOMIZADA (Seu Complemento) ---
    if (actorData.type === 'mage') {
      systemData.gamesystem = 'mage'; // Adiciona o gamesystem 'mage'
      
      // Chamada das suas funções de cálculo (Complemento)
      systemData.spheres = await prepareSpheres(actorData); // Prepara as esferas
      systemData.bonuses = await getMageModifiers(systemData); // Calcula bônus
    }

    // --- 2. CHAMAR O RESTANTE DO SISTEMA (Super) ---
    // Executa o cálculo de Atributos, Perícias, Saúde, etc., do sistema WoD5E.
    await super.prepareDerivedData(); 
  }

  // --- O MÉTODO validate DEVE EXISTIR PARA O LIBWRAPPER ---
  /**
   * @override
   * Este método será empacotado pelo libWrapper para contornar o erro.
   */
  validate(options) {
    // Esta função será substituída pelo libWrapper para IGNORAR a validação do tipo 'mage'.
    return super.validate(options); 
  }
}