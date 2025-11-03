/* global Hooks */

// Assumindo que BaseDefinitionClass pode ser importado do sistema base
import { BaseDefinitionClass } from '/systems/vtm5e/system/api/def/base-definition-class.js' 

// CLONANDO a estrutura de um arquivo de definição de Features/Disciplines
export class Spheres extends BaseDefinitionClass {
  static onReady () {
    Spheres.setSortAlphabetically()
    Spheres.initializeLabels()
  }

  // 🔮 Definição das 9 Esferas (Clonando o padrão de Disciplines/Gifts)
  static correspondence = { label: 'WOD5E.MTA.Correspondence' }
  static entropy = { label: 'WOD5E.MTA.Entropy' }
  static forces = { label: 'WOD5E.MTA.Forces' }
  static life = { label: 'WOD5E.MTA.Life' }
  static matter = { label: 'WOD5E.MTA.Matter' }
  static mind = { label: 'WOD5E.MTA.Mind' }
  static prime = { label: 'WOD5E.MTA.Prime' }
  static spirit = { label: 'WOD5E.MTA.Spirit' }
  static time = { label: 'WOD5E.MTA.Time' }
}

Hooks.once('ready', Spheres.onReady)