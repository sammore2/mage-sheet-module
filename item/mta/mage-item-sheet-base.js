/* global foundry */

// Importa a classe de Ficha Base do WoD5e (wod-item-base.js)
import { WoDItem } from "/systems/vtm5e/system/item/wod-item-base.js"; 

/**
 * Estende a ficha base de Item do WoD5e (wod-item-base.js).
 * É a base para todas as fichas de Rotina, Esfera, Tradição, etc.
 * @extends {WoDItem}
 */
export class MageItemSheetBase extends WoDItem {
  
  // O DEFAULT_OPTIONS, PARTS e TABS são definidos na classe que o estende (SphereItemSheet, etc.), 
  // mas esta classe define a lógica de estilo.

  /**
   * @override
   * Este método é CLONADO do wod-item-base.js para adicionar o styling 'mage'.
   */
  _onRender () {
    super._onRender();
    const html = this.element;

    // Clonando a lógica do sistema base para adicionar a classe CSS 'mage'
    const gamesystem = this.item.system.gamesystem; // Espera-se 'mage' (definido em mage-item.js)
    
    if (gamesystem === 'mage') {
      // Remove todas as outras classes de splat e adiciona a sua.
      html.classList.remove('vampire', 'hunter', 'werewolf', 'mortal'); 
      html.classList.add('mage'); 
    }
  }
}