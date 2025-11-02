/**
 * MageActorSheet
 * Esta classe é a controladora da nossa Ficha de Mago.
 * Ela herda (extends) da MortalActorSheet do sistema vtm5e.
 */
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
    // Exemplo: Ouvinte para rolar Arete
    html.find('.roll-arete').click(this._onRollArete.bind(this))

    // Exemplo: Ouvinte para rolar Paradoxo
    html.find('.roll-paradox').click(this._onRollParadox.bind(this))

    // Exemplo: Ouvinte para rolar Sabedoria (remorse)
    html.find('.roll-wisdom').click(this._onRollWisdom.bind(this))
  }

  /**
   * Função para lidar com a rolagem de Arete (Mágica).
   * @param {Event} event - O evento de clique.
   */
  _onRollArete (event) {
    event.preventDefault()
    // AINDA VAMOS IMPLEMENTAR A LÓGICA DE ROLAGEM
    // Por agora, apenas um log:
    console.log('Mage Module | Roll Arete Clicado!')
    // No futuro, chamará a sua lógica de paradox-roll.js
  }

  /**
   * Função para lidar com a rolagem de Paradoxo (Backlash).
   * @param {Event} event - O evento de clique.
   */
  _onRollParadox (event) {
    event.preventDefault()
    console.log('Mage Module | Roll Paradox Clicado!')
    // No futuro, chamará a sua lógica de paradox-backlash.js
  }

  /**
   * Função para lidar com a rolagem de Sabedoria (Degeneração).
   * @param {Event} event - O evento de clique.
   */
  _onRollWisdom (event) {
    event.preventDefault()
    console.log('Mage Module | Roll Wisdom Clicado!')
    // No futuro, chamará a sua lógica de wisdom-roll.js
  }
}