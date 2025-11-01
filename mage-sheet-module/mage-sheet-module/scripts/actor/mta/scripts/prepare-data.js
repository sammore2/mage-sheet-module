// --- IMPORTAÇÃO CORRIGIDA ---
// Em vez de '...', o caminho agora aponta para a NOSSA api de esferas.
import { Spheres } from '../../../../api/def/spheres.js'

/**
 * Prepara o objeto 'spheres' no ator
 */
export const prepareSpheres = async function (actor) {
  // Secondary variables
  // Agora 'Spheres.getList()' vai funcionar!
  const spheresList = Spheres.getList({})
  const actorSpheres = actor.system?.spheres
  const computedSpheres = {}

  for (const [id, value] of Object.entries(spheresList)) {
    let sphereData = {}

    // (O resto desta função está 100% correto como você copiou)
    // Se o ator tem a esfera, pega os valores
    if (Object.prototype.hasOwnProperty.call(actorSpheres, id)) {
      sphereData = Object.assign({
        id,
        value: actorSpheres[id].value || 0,
        powers: actorSpheres[id].powers || [],
        description: actorSpheres[id]?.description || '',
        visible: actorSpheres[id].visible,
        selected: actorSpheres[id].selected || false
      }, value)
    } else { // Se não, adiciona com valores padrão
      sphereData = Object.assign({
        id,
        value: 0,
        visible: false,
        description: '',
        powers: [],
        selected: false
      }, value)
    }

    if (!computedSpheres[id]) computedSpheres[id] = {}
    computedSpheres[id] = sphereData

    if (!computedSpheres[id].visible && computedSpheres[id].value > 0) {
      computedSpheres[id].visible = true
    }
    if (computedSpheres[id].hidden) {
      computedSpheres[id].visible = false
    }

    // Pega todos os "poderes" (Itens) que pertencem a esta esfera
    computedSpheres[id].powers = actor.items.filter(item =>
      item.type === 'power' && item.system.sphere === id
    )
  }

  return computedSpheres
}

/**
 * Prepara e organiza os poderes dentro das esferas
 */
export const prepareSpherePowers = async function (spheres) {
  // (Esta função está 100% correta como você copiou)
  for (const sphereType in spheres) {
    if (Object.prototype.hasOwnProperty.call(spheres, sphereType)) {
      const sphere = spheres[sphereType]

      if (sphere && Array.isArray(sphere.powers)) {
        // Checa se tem poderes
        if (sphere.powers.length > 0) {
          // Garante a visibilidade
          if (!sphere.visible && !sphere.hidden) sphere.visible = true

          // Organiza os poderes por nível
          sphere.powers = sphere.powers.sort(function (power1, power2) {
            const level1 = power1.system ? power1.system.level : 0
            const level2 = power2.system ? power2.system.level : 0

            // Se o nível for igual, organiza por nome
            if (level1 === level2) {
              return power1.name.localeCompare(power2.name)
            }

            // Organiza por nível
            return level1 - level2
          })
        }
      } else {
        // Se 'powers' não for um array, loga um erro
        console.error(`Mage Sheet Module | Sphere ${sphereType} powers is not an array:`, sphere)
      }
    }
  }
  return spheres
}