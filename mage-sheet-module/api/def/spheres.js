/* global game */

// Este arquivo define o que são as Esferas de Mago.
// Diferente do sistema 'wod5e', não podemos "estender" a "BaseDefinitionClass"
// porque ela não é exportada para módulos.
//
// Então, vamos criar um objeto simples que tem o método 'getList()'
// que o seu script 'prepare-data.js' espera.

export const Spheres = {
  // A função que o 'prepare-data.js' chama
  getList: (options = {}) => {
    // Retorna a lista de todas as 9 Esferas
    return {
      correspondence: {
        name: game.i18n.localize('WOD5E.MTA.Correspondence') // (Adicione em lang/pt-BR.json)
      },
      entropy: {
        name: game.i18n.localize('WOD5E.MTA.Entropy')
      },
      forces: {
        name: game.i18n.localize('WOD5E.MTA.Forces')
      },
      life: {
        name: game.i18n.localize('WOD5E.MTA.Life')
      },
      matter: {
        name: game.i18n.localize('WOD5E.MTA.Matter')
      },
      mind: {
        name: game.i18n.localize('WOD5E.MTA.Mind')
      },
      prime: {
        name: game.i18n.localize('WOD5E.MTA.Prime')
      },
      spirit: {
        name: game.i18n.localize('WOD5E.MTA.Spirit')
      },
      time: {
        name: game.i18n.localize('WOD5E.MTA.Time')
      }
    }
  }
}