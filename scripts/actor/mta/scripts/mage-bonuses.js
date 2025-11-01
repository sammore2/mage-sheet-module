/* global game */

// Importa o "motor" de Arete que NÓS refatoramos
import { getAreteValues } from './arete.js'

/**
 * Função renomeada para 'getMageModifiers'
 * Esta função é chamada pela ficha para adicionar bônus passivos.
 */
export const getMageModifiers = async function (actorData) {
  // Pega os valores da nossa tabela em arete.js
  // (Variável renomeada para 'areteValues' para evitar erros de caso)
  const areteValues = await getAreteValues(actorData.arete.potency)

  // Lista de bônus que esta ficha concede
  const bonuses = [
    {
      /**
       * Bônus: Bônus de Roteiro (Rote Bonus)
       * Este bônus (definido em arete.js) é adicionado
       * a qualquer rolagem que tenha o seletor 'rote' (Roteiro).
       */
      source: game.i18n.localize('WOD5E.MTA.RoteBonus'), // (Adicione esta tradução)
      value: areteValues.roteBonus, // Pega o valor CORRETO (roteBonus)
      paths: [], // Aplica-se a qualquer rolagem (não só atributos ou skills)
      activeWhen: {
        check: 'isPath',
        path: 'rote' // (O .hbs do seu "Roteiro" (Item) deve ter um data-selector="rote")
      }
    }
    
    /**
     * NOTA: Removemos o bônus de "Surge" (Aumento de Sangue)
     * porque ele não existe mais no nosso 'arete.js'.
     * A mecânica de "gastar 1 Paradoxo para ganhar dados extras"
     * (que era o Surge) é resolvida pelo nosso 'paradox-roll.js' 
     * e não precisa de um bônus passivo aqui.
     */
  ]

  return bonuses
}