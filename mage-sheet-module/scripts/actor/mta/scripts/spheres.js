/* global game, WOD5E, foundry, ChatMessage */

// --- CORREÇÃO 1: Importar o NOSSO arquivo de Esferas ---
// O caminho (../../../../) sobe 4 níveis para chegar na raiz do módulo
// e encontrar a pasta 'api/'.
import { Spheres } from '../../../../api/def/spheres.js'

/** Handle adding a new sphere to the sheet */
export const _onAddSphere = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  // --- CORREÇÃO 1 (Continuação): Usar o 'Spheres' que importamos ---
  const sphereList = Spheres.getList({})

  // Build the options for the select dropdown
  const content = new foundry.data.fields.StringField({
    choices: sphereList,
    label: game.i18n.localize('WOD5E.MTA.SelectSphere'), // (Você corrigiu, está certo)
    required: true
  }).toFormGroup({},
    {
      name: 'sphere'
    }).outerHTML

  // Prompt a dialog to determine which sphere we're adding
  const sphereSelected = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.MTA.AddSphere') // (Você corrigiu, está certo)
    },
    classes: ['wod5e', 'dialog', 'mage', 'dialog'], // (Você corrigiu, está certo)
    content,
    ok: {
      callback: (event, button) => new foundry.applications.ux.FormDataExtended(button.form).object.sphere
    },
    modal: true
  })

  if (sphereSelected) {
    // Make the sphere visible
    actor.update({ [`system.spheres.${sphereSelected}.visible`]: true })

    // Update the currently selected sphere and power
    _updateSelectedSphere(actor, sphereSelected)
    _updateSelectedSpherePower(actor, '')
  }
}

/** Handle removing a sphere from an actor */
export const _onRemoveSphere = async function (event, target) {
  // (Esta função está 100% correta)
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const sphere = target.getAttribute('data-sphere')

  actor.update({
    [`system.spheres.${sphere}.visible`]: false
  })
}

/** Post Sphere description to the chat */
export const _onSphereToChat = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const sphere = actor.system.spheres[target.getAttribute('data-sphere')]

  // --- CORREÇÃO 2: Apontar para o template do 'wod5e' ---
  await foundry.applications.handlebars.renderTemplate('systems/wod5e/display/ui/chat/chat-message-content.hbs', {
    name: sphere.displayName,
    img: 'icons/svg/dice-target.svg', // (Ícone genérico, pode mudar se quiser)
    description: sphere?.description
  }).then(html => {
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
    ChatMessage.create(message)
  })
}

/** Select a sphere to display */
export const _onSelectSphere = async function (event, target) {
  // (Esta função está 100% correta)
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const sphere = target.getAttribute('data-sphere')

  _updateSelectedSphere(actor, sphere)
}

/** Select a power to display */
export const _onSelectSpherePower = async function (event, target) {
  // (Esta função está 100% correta)
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const power = target.getAttribute('data-power')

  _updateSelectedSpherePower(actor, power)
}

export const _updateSelectedSpherePower = async function (actor, power) {
  // (Esta função está 100% correta)
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a valid power defined
  if (power && actor.items.get(power)) {
    const powerItem = actor.items.get(power)
    const sphere = powerItem.system.sphere

    // Update the selected power
    updatedData.selectedSpherePower = power
    powerItem.update({
      system: {
        selected: true
      }
    })

    // Update the selected spheres
    _updateSelectedSphere(actor, sphere)
  } else {
    // Revert to an empty string
    updatedData.selectedSpherePower = ''
  }

  // Unselect the previously selected power
  const previouslySelectedPower = actor.system?.selectedSpherePower
  if (previouslySelectedPower && actor.items.get(previouslySelectedPower) && previouslySelectedPower !== power) {
    actor.items.get(previouslySelectedPower).update({
      system: {
        selected: false
      }
    })
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}

export const _updateSelectedSphere = async function (actor, sphere) {
  // (Esta função está 100% correta)
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a sphere defined
  if (sphere && actor.system.spheres[sphere]) {
    updatedData.spheres ??= {}
    updatedData.spheres[sphere] ??= {}

    // Update the selected spheres
    updatedData.selectedSphere = sphere
    updatedData.spheres[sphere].selected = true
  } else {
    // Revert to an empty string
    updatedData.selectedSphere = ''
  }

  // Unselect the previously selected sphere

  const previouslySelectedSphere = actor.system?.selectedSphere
  if (previouslySelectedSphere && previouslySelectedSphere !== sphere) {
    updatedData.spheres[previouslySelectedSphere] ??= {}
    updatedData.spheres[previouslySelectedSphere].selected = false
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}