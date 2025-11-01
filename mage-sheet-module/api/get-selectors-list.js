  const spheres = WOD5E.Spheres.getList({
    prependType: true
  })
  // "All Spheres" selector
  selectorsList.push({
    id: 'spheres',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.MTA.Spheres')
    })
  })
  // Individual disciplines
  for (const [key, value] of Object.entries(spheres)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }
  // Frenzy
  selectorsList.push({
    id: 'frenzy',
    displayName: game.i18n.localize('WOD5E.MTA.Frenzy')
  })
  // Remorse
  selectorsList.push({
    id: 'humanity',
    displayName: game.i18n.localize('WOD5E.MTA.Remorse')
  })
  // Feeding
  selectorsList.push({
    id: 'feeding',
    displayName: game.i18n.localize('WOD5E.MTA.Feeding')
  })
