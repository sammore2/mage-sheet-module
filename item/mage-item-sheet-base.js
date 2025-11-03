/* global foundry */

// Importa a classe de Ficha Base do WoD5e
import { WoDItem } from "/systems/wod5e/module/item/wod-item-base.js"; 

/**
 * Estende a ficha base de Item do WoD5e (wod-item-base.js).
 * É a base para todas as fichas de Rotina, Esfera, Tradição, etc.
 * @extends {WoDItem}
 */
export class MageItemSheetBase extends WoDItem {
  // O construtor, DEFAULT_OPTIONS e a maioria dos métodos são herdados.

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
      // O clone V5 usa: html.classList.remove('hunter', 'werewolf', 'vampire', 'mortal');
      html.classList.remove('vampire', 'hunter', 'werewolf', 'mortal'); 
      html.classList.add('mage'); 
    }
  }

  // O restante dos métodos (onSubmit, activateListeners) são herdados.
}