/* global Item, Hooks, WOD5E */

// Importa a classe de Item base do sistema WoD5e
import { WoDItem } from "/systems/wod5e/module/item/item.js"; 

/**
 * Estende a classe de dados base do Item do WoD5e.
 * Qualquer item de Mago (Esfera, Rotina) usará esta classe como dados.
 * @extends {WoDItem}
 */
export class MageItem extends WoDItem {
  // A lógica de prepareData e prepareDerivedData é herdada de WoDItem.
  
  /**
   * @override
   * Prepara dados derivados específicos de Itens Mago (ex: Paradoxo potencial da Rotina).
   */
  async prepareDerivedData () {
    // Top-level variables
    const itemData = this.system;

    // Lógica para injetar o "gamesystem: mage" no item para fins de CSS/Automação
    itemData.gamesystem = 'mage'; 

    // Lógica para Potencializar Dano (Clonando o V5/W5, se aplicável)
    // Se o item for uma Rotina (Rote) que causa dano, o dano pode ser aumentado 
    // com base no Arete do Mago (acessível via this.actor.system.blood.potency, etc.).
    
    // ... Implementação futura para Arete/Potência do Item ...
  }
}

// O Hook 'preCreateItem' que define o ícone padrão será herdado/executado
// se o seu ItemType for registrado corretamente no WOD5E.ItemTypes.

// Exportação para uso no hooks.js
export default MageItem;