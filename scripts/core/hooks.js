/* -------------------------------------------- */
/* HOOK: INIT (VAZIO DE PROPÓSITO)              */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  console.log('Mage: The Ascension 5e | 1. Registrando hook inicial.');
  // Deixamos o init vazio de propósito. Vamos esperar o 'ready'.
});

/* -------------------------------------------- */
/* HOOK: READY (INJEÇÃO, CLASSES E REGISTRO)    */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
  console.log('Mage: The Ascension 5e | 2. Executando injeção de dados e registro de classes.');

  // --- 1. INJEÇÃO DE DADOS ---
  // CORREÇÃO: Usar CONFIG.vtm5e (o ID do sistema do seu module.json)
  const actorTemplate = CONFIG.vtm5e.template.Actor;
  const itemTemplate = CONFIG.vtm5e.template.Item;

  // (Baseado no seu template.json, que agora está sendo injetado no 'mortal')
  const mageDataInjection = {
    isMage: false,
    arete: { value: 1, max: 10 },
    paradox: { value: 0, max: 10 },
    quintessence: { value: 0, max: 10 },
    wisdom: { value: 7, stains: 0 },
    frenzyActive: false,
    spheres: {
      correspondence: { value: 0, powers: [], visible: false },
      entropy: { value: 0, powers: [], visible: false },
      forces: { value: 0, powers: [], visible: false },
      life: { value: 0, powers: [], visible: false },
      matter: { value: 0, powers: [], visible: false },
      mind: { value: 0, powers: [], visible: false },
      prime: { value: 0, powers: [], visible: false },
      spirit: { value: 0, powers: [], visible: false },
      time: { value: 0, powers: [], visible: false }
    }
  };
  
  // Injeta os dados de Mago no template "mortal"
  foundry.utils.mergeObject(actorTemplate.mortal, mageDataInjection);

  // --- 2. REGISTRO DE ITENS ---
  itemTemplate.types.push('rote');
  itemTemplate.rote = foundry.utils.deepClone(itemTemplate.power);
  foundry.utils.mergeObject(itemTemplate.rote, { gamesystem: 'mage', arcana: '', paradoxCost: 0 });
  CONFIG.Item.typeLabels.rote = 'MTA.Rote'; // (Certifique-se que MTA.Rote existe na sua tradução)

  itemTemplate.types.push('focus');
  itemTemplate.focus = foundry.utils.deepClone(itemTemplate.feature);
  foundry.utils.mergeObject(itemTemplate.focus, { gamesystem: 'mage', featuretype: 'focus' });
  CONFIG.Item.typeLabels.focus = 'MTA.Focus'; // (Certifique-se que MTA.Focus existe na sua tradução)

  // --- 3. DEFINIÇÃO DAS CLASSES ---
  // Agora é 100% seguro estender as classes do vtm5e!

  /**
   * MageRoll
   * Estende a RollFormula base para usar Paradoxo.
   */
  // CORREÇÃO: Usar game.vtm5e
  class MageRoll extends game.vtm5e.RollFormula {
    _prepareData (rollData) {
      super._prepareData(rollData);
      const paradoxDice = Math.max(0, this.hungerDice);
      this.dice = this.dice.slice(paradoxDice);
      const paradox = this.dice.slice(0, paradoxDice);
      const normalSuccesses = this.dice.filter(d => d.success).length;
      const normalCrits = this.dice.filter(d => d.critical).length;
      const paradoxSuccesses = paradox.filter(d => d.success).length;
      const paradoxCrits = paradox.filter(d => d.critical).length;
      const paradoxFailures = paradox.filter(d => d.failure).length;
      this.successes = normalSuccesses + (normalCrits * 2) + paradoxSuccesses + (paradoxCrits * 2);

      // CORREÇÃO: As localizações "WOD5E.Chat" não existem no vtm5e, 
      // mas "VTM5E.Chat" sim. Vamos usar as do vtm5e.
      if (paradoxFailures > 0) {
        this.outcome = 'bestial';
        this.outcomeLabel = game.i18n.localize('MTA.Backlash'); // (MTA.Backlash - OK)
      } else if (this.successes === 0) {
        this.outcome = 'failure';
        this.outcomeLabel = game.i18n.localize('VTM5E.Chat.Failure'); // (Corrigido)
      } else if (normalCrits > 0 || paradoxCrits > 0) {
        this.outcome = 'critical';
        this.outcomeLabel = game.i18n.localize('VTM5E.Chat.CriticalSuccess'); // (Corrigido)
      } else {
        this.outcome = 'success';
        this.outcomeLabel = game.i18n.localize('VTM5E.Chat.Success'); // (Corrigido)
      }
      this.rollResults = {
        normal: { rolls: this.dice, icon: this.rollIcons.normal },
        paradox: { rolls: paradox, icon: this.rollIcons.hunger }
      };
    }
  }

  /**
   * MageRollDialog
   * CORREÇÃO: Estende VampireRollDialog (que é game.vtm5e.VampireRollDialog)
   */
  class MageRollDialog extends game.vtm5e.VampireRollDialog {
    static get defaultOptions () {
      return foundry.utils.mergeObject(super.defaultOptions, {
        template: 'modules/mage-sheet-module/templates/ui/mage-roll-dialog.hbs'
      });
    }
    async getData () {
      const data = await super.getData();
      data.hungerValue = this.actor.system.paradox.value;
      data.hungerLabel = game.i18n.localize('MTA.Paradox');
      // data.hungerDiceIcon = 'assets/icons/dialog/vampire-dice.png'; // (Mantido, mas você pode mudar o ícone)
      return data;
    }
    _onRoll (event) {
      event.preventDefault();
      const form = event.currentTarget.closest('form');
      const combinedPool = parseInt(form.pool1.value) + parseInt(form.pool2.value);
      const rollData = {
        actor: this.actor,
        pool: combinedPool,
        difficulty: parseInt(form.difficulty.value),
        hungerDice: parseInt(form.hunger_dice.value),
        rollType: 'mage',
        rollMode: form.rollMode.value,
        modifiers: this.modifiers
      };
      const roll = new MageRoll(rollData);
      roll.toMessage();
      this.close();
    }
  }

  /**
   * MageActorSheet
   * CORREÇÃO: Estende MortalActorSheet (que é game.vtm5e.MortalActorSheet)
   */
  class MageActorSheet extends game.vtm5e.MortalActorSheet {
    static get defaultOptions () {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ['vtm5e', 'sheet', 'actor', 'mage'], // 'vtm5e' é importante
        template: 'modules/mage-sheet-module/templates/actors/mage-sheet.hbs',
        tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'stats' }]
      });
    }

    async getData () {
      const data = await super.getData();
      this._prepareMageData(data.actor);
      // Habilita as abas
      data.actor.system.tabs = {
        stats: true,
        spheres: true,
        equipment: true,
        features: true,
        biography: true,
        experience: true,
        notepad: true,
        settings: true
      };
      return data;
    }

    _prepareMageData (actorData) {
      const system = actorData.system;
      system.sortedSpheres = Object.entries(system.spheres).map(([key, sphere]) => {
        return {
          key: key,
          label: game.i18n.localize(`MTA.Sphere.${key}`), // (Certifique-se que MTA.Sphere.x existe)
          ...sphere
        };
      });
    }

    activateListeners (html) {
      super.activateListeners(html);
      if (this.actor.system.locked) return;
      html.find('.roll-arete').click(this._onRollArete.bind(this));
      html.find('.roll-paradox').click(this._onRollParadox.bind(this));
      html.find('.roll-wisdom').click(this._onRollWisdom.bind(this));
    }

    async _onRollArete (event) {
      event.preventDefault();
      const sphereOptions = this.actor.system.sortedSpheres.map(s => ({
        key: s.key,
        label: s.label,
        value: s.value
      }));
      sphereOptions.unshift({
        key: 'none',
        label: game.i18n.localize('VTM5E.None'), // (Corrigido)
        value: 0
      });
      const dialog = new MageRollDialog({
        actor: this.actor,
        title: game.i18n.localize('MTA.Roll.Arete'),
        pool1: { label: game.i18n.localize('MTA.Arete'), value: this.actor.system.arete.value },
        pool2: { label: game.i18n.localize('MTA.Sphere'), hasSelect: true, options: sphereOptions }
      });
      dialog.render(true);
    }

    async _onRollWisdom (event) {
      event.preventDefault();
      const system = this.actor.system;
      const remainingWisdom = system.wisdom.value - system.wisdom.stains;
      const roll = new game.vtm5e.RollFormula({ // CORREÇÃO: game.vtm5e
        actor: this.actor,
        pool: remainingWisdom,
        difficulty: 1,
        rollType: 'remorse',
        title: game.i18n.localize('MTA.Roll.Wisdom')
      });
      await roll.toMessage();
      this.actor.update({ 'system.wisdom.stains': 0 });
    }

    async _onRollParadox (event) {
      event.preventDefault();
      const system = this.actor.system;
      const paradox = system.paradox.value;
      const roll = new game.vtm5e.RollFormula({ // CORREÇÃO: game.vtm5e
        actor: this.actor,
        pool: paradox,
        difficulty: 1,
        rollType: 'frenzy',
        title: game.i18n.localize('MTA.Roll.Backlash')
      });
      await roll.toMessage();
    }
  }

  // --- 4. REGISTRO DA FICHA (SHEET) ---
  Actors.unregisterSheet('vtm5e', 'MortalActorSheet'); // Desregistra a ficha de mortal padrão
  Actors.registerSheet('vtm5e', MageActorSheet, {
    types: ['mortal'], // Registra sua ficha para o tipo 'mortal'
    makeDefault: true,
    label: 'MTA.SheetTitle' // (Certifique-se que MTA.SheetTitle existe na tradução)
  });

  console.log('Mage: The Ascension 5e | 3. Ficha de Mago registrada para Atores Mortais.');
});