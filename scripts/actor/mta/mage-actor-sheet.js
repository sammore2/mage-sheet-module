/**
 * MageActorSheet
 * Esta classe é a controladora da nossa Ficha de Mago.
 * Ela herda (extends) da MortalActorSheet do sistema vtm5e.
 */
// Importa nossa nova classe de diálogo de rolagem
import { MageRollDialog } from './scripts/mage-roll.js'

export class MageActorSheet extends game.vtm5e.MortalActorSheet {
  /**
   * @override
   * Define as opções padrão desta ficha (sheet).
   */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['vtm5e', 'sheet', 'actor', 'mage'], // Adiciona a classe 'mage' para o CSS
      template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs', // Caminho para o NOSSO template HTML
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'stats'
        }
      ]
    })
  }

  /**
   * @override
   * Prepara os dados para serem enviados para o template HBS.
   * Aqui nós adicionamos nossos dados de Mago (Arete, Paradoxo, Esferas).
   */
  async getData () {
    // Pega todos os dados da ficha de Mortal (atributos, perícias, etc.)
    const data = await super.getData()

    // Prepara os dados específicos de Mago (que injetamos no hooks.js)
    this._prepareMageData(data.actor)

    // Define as abas que nossa ficha terá (baseado no seu template.json)
    data.actor.system.tabs = {
      stats: true,
      spheres: true, // Nossa nova aba!
      equipment: true,
      features: true,
      biography: true,
      experience: true,
      notepad: true,
      settings: true
    }

    return data
  }

  /**
   * Prepara os dados de Mago para exibição na ficha.
   * @param {object} actorData - Os dados do ator.
   */
  _prepareMageData (actorData) {
    const system = actorData.system

    // Cria um array ordenado das Esferas para o HBS poder iterar (fazer um loop)
    // Usamos as chaves que definimos no hooks.js
    system.sortedSpheres = Object.entries(system.spheres).map(([key, sphere]) => {
      return {
        key: key,
        // Pega o nome traduzido do nosso arquivo de linguagem (ex: "MTA.Sphere.prime")
        label: game.i18n.localize(`MTA.Sphere.${key}`),
        ...sphere
      }
    })

    // (Aqui você pode adicionar mais preparações de dados, se necessário)
  }

  /**
   * @override
   * Adiciona os "ouvintes" de eventos (event listeners) para a ficha.
   * É aqui que adicionamos a funcionalidade de clique nos botões.
   */
  activateListeners (html) {
    // Ativa TODOS os listeners da ficha de Mortal (clicar em atributos, etc.)
    super.activateListeners(html)

    // Se a ficha estiver bloqueada, não adicione nossos listeners customizados
    if (this.actor.system.locked) return

    // --- ADICIONE SEUS LISTENERS DE MAGO AQUI ---
    // Ouvinte para rolar Arete
    html.find('.roll-arete').click(this._onRollArete.bind(this))

    // Ouvinte para rolar Paradoxo
    html.find('.roll-paradox').click(this._onRollParadox.bind(this))

    // Ouvinte para rolar Sabedoria (remorse)
    html.find('.roll-wisdom').click(this._onRollWisdom.bind(this))
  }

  /**
   * @override
   * Função para lidar com a rolagem de Arete (Mágica).
   * @param {Event} event - O evento de clique.
   */
  async _onRollArete (event) {
    event.preventDefault()

    // Abre o nosso novo MageRollDialog
    const dialog = new MageRollDialog({
      actor: this.actor,
      title: game.i18n.localize('MTA.Roll.Arete'), // Título da janela
      pool1: { // Pool 1 (Arete)
        label: game.i18n.localize('MTA.Arete'),
        value: this.actor.system.arete.value
      },
      pool2: { // Pool 2 (Esfera - AINDA VAMOS IMPLEMENTAR SELEÇÃO)
        label: game.i18n.localize('MTA.Sphere'),
        value: 0 // O ideal é o usuário selecionar a esfera
      }
    })
    dialog.render(true)
  }

  /**
   * @override
   * Função para lidar com a rolagem de Sabedoria (Degeneração).
   * (Esta lógica é copiada do roll-remorse.js do vtm5e)
   */
  async _onRollWisdom (event) {
    event.preventDefault()

    const system = this.actor.system
    const wisdom = system.wisdom.value
    const stains = system.wisdom.stains
    const remainingWisdom = wisdom - stains

    // Cria a fórmula da rolagem (Dados = Sabedoria restante)
    const roll = new game.vtm5e.RollFormula({
      actor: this.actor,
      pool: remainingWisdom,
      difficulty: 1, // Dificuldade é sempre 1
      rollType: 'remorse',
      title: game.i18n.localize('MTA.Roll.Wisdom')
    })

    // Envia para o chat
    await roll.toMessage()

    // Limpa as Stains (Manchas) após a rolagem
    this.actor.update({ 'system.wisdom.stains': 0 })
  }

  /**
   * @override
   * Função para lidar com a rolagem de Paradoxo (Backlash).
   * (Esta lógica é copiada do frenzy-roll.js do vtm5e)
   */
  async _onRollParadox (event) {
    event.preventDefault()
    
    const system = this.actor.system
    const paradox = system.paradox.value // Rola o total de Paradoxo atual

    const roll = new game.vtm5e.RollFormula({
      actor: this.actor,
      pool: paradox,
      difficulty: 1, // Dificuldade é sempre 1
      rollType: 'frenzy', // Reutilizando o tipo 'frenzy' para a cor vermelha
      title: game.i18n.localize('MTA.Roll.Backlash')
    })

    await roll.toMessage()
  }
} // <- Fim da classe MageActorSheet