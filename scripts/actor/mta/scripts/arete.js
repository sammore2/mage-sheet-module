/* global game */

// Surge: Amount of dice added on a blood surge (Mago: Dados de Paradoxo)
// Mend: Amount mended on expenditure of vitae (Mago: Quintessência Consumida/Curada)
// Power: Bonus to discipline powers (Mago: Bônus de Roteiro)
// Rouse: Max level of powers that can be rouse-rerolled (Mago: Esfera Máxima)
// Bane: Bane severity number (Mago: Limite de Paradoxo/Severidade)
export const getAreteValues = async function (level) {
  const ARETE_VALUES = [
    // Potency 0
{
      paradoxDice: 0,
      quintessencePool: 0,
      roteBonus: 0,
      maxSphere: 0,
      paradoxLimit: 0
    },
    // Potency 1 -> Iniciado
    {
      paradoxDice: 1,
      quintessencePool: 1,
      roteBonus: 0,
      maxSphere: 1,
      paradoxLimit: 2
    },
    // Potency 2
    {
      paradoxDice: 1,
      quintessencePool: 1,
      roteBonus: 1,
      maxSphere: 1,
      paradoxLimit: 2
    },
    // Potency 3
    {
      paradoxDice: 2,
      quintessencePool: 2,
      roteBonus: 1,
      maxSphere: 2,
      paradoxLimit: 3
    },
    // Potency 4
    {
      paradoxDice: 2,
      quintessencePool: 3,
      roteBonus: 2,
      maxSphere: 2,
      paradoxLimit: 3
    },
    // Potency 5
    {
      paradoxDice: 3,
      quintessencePool: 3,
      roteBonus: 2,
      maxSphere: 3,
      paradoxLimit: 4
    },
    // Potency 6
    {
      paradoxDice: 3,
      quintessencePool: 3,
      roteBonus: 3,
      maxSphere: 3,
      paradoxLimit: 4
    },
    // Potency 7
    {
      paradoxDice: 4,
      quintessencePool: 3,
      roteBonus: 3,
      maxSphere: 4,
      paradoxLimit: 5
    },
    // Potency 8
    {
      paradoxDice: 4,
      quintessencePool: 4,
      roteBonus: 4,
      maxSphere: 4,
      paradoxLimit: 5
    },
    // Potency 9
    {
      paradoxDice: 5,
      quintessencePool: 4,
      roteBonus: 4,
      maxSphere: 5,
      paradoxLimit: 6
    },
    // Potency 10
    {
      paradoxDice: 5,
      quintessencePool: 5,
      roteBonus: 5,
      maxSphere: 5,
      paradoxLimit: 6
    }
  ]
  
  const safeLevel = Math.max(0, Math.min(level, 10));
  return ARETE_VALUES[safeLevel];
}

// =========================================================================
// 2. getAreteText (CLONE ESTRUTURAL EXATO do V5 com strings estáticas)
// =========================================================================

export async function getAreteText (level) {
  // TODO : Some of this could be deducted from previous array.
    // O array é DEFINIDO ESTATICAMENTE dentro da função, como no template V5.
    const ARETE_TEXT = [
        // Nível 0
        {
          surge: game.i18n.localize('WOD5E.MTA.Add0ParadoxDice'), // Customizado para Mago (0 dados)
          mend: game.i18n.localize('WOD5E.MTA.Add0Quintessence'), // Customizado para Mago (0 cura/uso)
          power: game.i18n.localize('WOD5E.None'),
          rouse: game.i18n.localize('WOD5E.None'),
          bane: '0',
          feeding: game.i18n.localize('WOD5E.MTA.NoParadoxEffect')
        },
        // Nível 1
        {
          surge: game.i18n.localize('WOD5E.MTA.Add1ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add1Quintessence'),
          power: game.i18n.localize('WOD5E.None'),
          rouse: game.i18n.localize('WOD5E.MTA.Level1Sphere'),
          bane: '2',
          feeding: game.i18n.localize('WOD5E.MTA.NoParadoxEffect')
        },
        // Nível 2
        {
          surge: game.i18n.localize('WOD5E.MTA.Add1ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add1Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add1RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level1Sphere'),
          bane: '2',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty1')
        },
        // Nível 3
        {
          surge: game.i18n.localize('WOD5E.MTA.Add2ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add2Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add1RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level2Sphere'),
          bane: '3',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty2')
        },
        // Nível 4
        {
          surge: game.i18n.localize('WOD5E.MTA.Add2ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add3Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add2RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level2Sphere'),
          bane: '3',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty3')
        },
        // Nível 5
        {
          surge: game.i18n.localize('WOD5E.MTA.Add3ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add3Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add2RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level3Sphere'),
          bane: '4',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty4')
        },
        // Nível 6
        {
          surge: game.i18n.localize('WOD5E.MTA.Add3ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add3Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add3RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level3Sphere'),
          bane: '4',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty5')
        },
        // Nível 7
        {
          surge: game.i18n.localize('WOD5E.MTA.Add4ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add3Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add3RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level4Sphere'),
          bane: '5',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty5')
        },
        // Nível 8
        {
          surge: game.i18n.localize('WOD5E.MTA.Add4ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add4Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add4RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level4Sphere'),
          bane: '5',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty6')
        },
        // Nível 9
        {
          surge: game.i18n.localize('WOD5E.MTA.Add5ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add4Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add4RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level5Sphere'),
          bane: '6',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty6')
        },
        // Nível 10 (Arqui-Mago)
        {
          surge: game.i18n.localize('WOD5E.MTA.Add5ParadoxDice'),
          mend: game.i18n.localize('WOD5E.MTA.Add5Quintessence'),
          power: game.i18n.localize('WOD5E.MTA.Add5RoteDice'),
          rouse: game.i18n.localize('WOD5E.MTA.Level5Sphere'),
          bane: '6',
          feeding: game.i18n.localize('WOD5E.MTA.Penalty7')
        }
    ]

    const safeLevel = Math.max(0, Math.min(level, 10));
    return ARETE_TEXT[safeLevel];
}

// =========================================================================
// 3. areteToRouse (Template V5 Estrito) - Funcionalmente Adaptado
// =========================================================================

export const areteToRouse = async function (areteLevel, sphereLevel) {
  // Define whether to reroll dice based on the user's arete
  // and the sphere's level
  if (areteLevel === 0) {
    // Arete 0 never rolls additional paradox dice for spheres
    return false
  } else if (areteLevel > 8) {
    // Arete 9 and 10 always roll additional paradox dice for spheres
    return false 
  } else if (areteLevel > 6 && sphereLevel < 5) {
    // Arete 7 and 8 roll additional paradox dice on spheres below 5
    return false
  } else if (areteLevel > 4 && sphereLevel < 4) {
    // Arete 5 and 6 roll additional paradox dice on spheres below 4
    return false
  } else if (areteLevel > 2 && sphereLevel < 3) {
    // Arete 3 and 4 roll additional paradox dice on spheres below 3
    return false
  } else if (areteLevel > 0 && sphereLevel < 2) {
    // Arete 1 and 2 roll additional paradox dice on spheres below 2
    return false
  }

  // If none of the above are true, just roll 1 dice for the paradox check
  return false
}

// Exportação
export default {
    getAreteValues,
    getAreteText,
    areteToRouse
}