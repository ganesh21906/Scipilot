// Compute concise, relevant metrics per project type using project meta and/or API results
// Returns an array of { label, value, accent? }
export function computeMetrics(project = {}, results = {}) {
  const type = project?.projectType || 'Generic'
  const m = project?.meta || {}
  const out = []

  const fmtNum = (n, unit = '') => {
    if (n == null || isNaN(Number(n))) return '—'
    const v = Number(n)
    const s = Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
    return unit ? `${s} ${unit}` : s
  }

  const push = (label, value, accent) => out.push({ label, value, accent })

  switch (type) {
    case 'Bridge': {
      const span = Number(m.spanLength) || 160
      const width = Number(m.deckWidth) || 16
      const lanes = Number(m.lanes) || 4
      const cap = results?.metrics?.capacity || `${Math.round((span * lanes * 12) / 10)} kN`
      const cost = results?.metrics?.cost || `$${((span * width) / 15).toFixed(2)}M`
      const sf = results?.metrics?.safety || (1.8).toFixed(2)
      push('Main Span', fmtNum(span, 'm'))
      push('Deck Width', fmtNum(width, 'm'))
      push('Traffic Lanes', `${lanes}`)
      push('Capacity', cap, 'text-blue-300')
      push('Material Cost', cost, 'text-orange-300')
      push('Safety Factor', sf, 'text-green-300')
      break
    }
    case 'Building': {
      const floors = Number(m.floors) || 12
      const bhk = Number(m.bhk) || 3
      const carpet = Number(m.carpetArea) || (bhk === 4 ? 135 : 112)
      const superArea = Number(m.superArea) || (bhk === 4 ? 172 : 142)
      const units = Number(m.unitsPerFloor) || (bhk === 4 ? 2 : 3)
      push('Configuration', `${bhk} BHK`)
      push('Floors', `${floors}`)
      push('Units / Floor', `${units}`)
      push('Carpet Area / Unit', fmtNum(carpet, 'm²'))
      push('Super Area / Unit', fmtNum(superArea, 'm²'))
      push('Total Units', `${floors * units}`)
      break
    }
    case 'Tunnel': {
      const length = Number(m.length) || 2200
      const diameter = Number(m.diameter) || 10
      const support = m.supportClass || 'NATM-III'
      const ventilation = m.ventilation || 'Longitudinal'
      push('Length', fmtNum(length, 'm'))
      push('Excavation Ø', fmtNum(diameter, 'm'))
      push('Support Class', support)
      push('Ventilation', ventilation)
      push('Design Speed', `${m.speed || 80} km/h`)
      break
    }
    case 'Dam': {
      const h = Number(m.height) || 85
      const crest = Number(m.crestLength) || 480
      const reservoir = Number(m.reservoirVolume) || 120
      push('Dam Height', fmtNum(h, 'm'))
      push('Crest Length', fmtNum(crest, 'm'))
      push('Reservoir Volume', `${reservoir} Mm³`)
      push('Type', m.type || 'Concrete Gravity')
      push('Spillway', m.spillway || 'OG Weir with Radial Gates')
      break
    }
    case 'Road': {
      const length = Number(m.length) || 35
      const lanes = Number(m.lanes) || 4
      const speed = Number(m.designSpeed) || 80
      const aadt = Number(m.aadt) || 22000
      push('Length', fmtNum(length, 'km'))
      push('Lanes', `${lanes}`)
      push('Design Speed', `${speed} km/h`)
      push('AADT', fmtNum(aadt, 'veh/day'))
      push('Pavement', m.pavement || 'Flexible (Bituminous)')
      break
    }
    case 'Foundation': {
      const typeF = m.type || 'Pile Group'
      const piles = Number(m.piles) || 36
      const capLoad = Number(m.capacity) || 4500
      push('Type', typeF)
      push('No. of Piles', `${piles}`)
      push('Group Capacity', fmtNum(capLoad, 'kN'))
      push('Embedment', fmtNum(m.embedment || 18, 'm'))
      push('Soil', m.soil || 'Medium Dense Sand')
      break
    }
    default: {
      push('Status', results?.status || 'Ready')
      break
    }
  }

  return out
}
