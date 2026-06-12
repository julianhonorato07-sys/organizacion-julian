// ---------------------------------------------------------------
// Paleta de colores (replica la hoja de cálculo original)
// ---------------------------------------------------------------
export const COLORS = {
  none:    { bg: '#ffffff', text: '#1e293b', label: 'Sin color' },
  wake:    { bg: '#fde047', text: '#1e293b', label: 'Amarillo (Despertarse)' },
  work:    { bg: '#d9ead3', text: '#1e293b', label: 'Verde claro (Trabajo)' },
  epro:    { bg: '#ffe599', text: '#1e293b', label: 'Crema (Epro / Eval. de proyectos)' },
  io:      { bg: '#6aa84f', text: '#ffffff', label: 'Verde (Investigación Operativa)' },
  comex:   { bg: '#6fa8dc', text: '#1e293b', label: 'Azul (Comercio Exterior)' },
  mant:    { bg: '#00ffff', text: '#1e293b', label: 'Cian (Mantenimiento)' },
  manejo:  { bg: '#b4a7d6', text: '#1e293b', label: 'Violeta (Manejo de Materiales)' },
  cgestion:{ bg: '#ea9999', text: '#1e293b', label: 'Rosa (Control de Gestión)' },
  sust:    { bg: '#cccccc', text: '#1e293b', label: 'Gris (Sustentabilidad)' },
  innov:   { bg: '#1c4587', text: '#ffffff', label: 'Azul oscuro (Innovación estratégica)' },
  orange:  { bg: '#ff9900', text: '#1e293b', label: 'Naranja (Control de Gestión - Gantt)' },
  gold:    { bg: '#f1c232', text: '#1e293b', label: 'Dorado (Mantenimiento - Gantt)' },
  mauve:   { bg: '#d5a6bd', text: '#1e293b', label: 'Malva (Sustentabilidad - Gantt)' },
  tesis:   { bg: '#cfe2f3', text: '#1e293b', label: 'Celeste (Tesis)' },
  red:     { bg: '#e06666', text: '#ffffff', label: 'Rojo (Parcial / urgente)' },
}

// Días: clave interna única, etiqueta visible (L M M J V S D como en la planilla)
export const DAYS = [
  { key: 'lun', label: 'L' },
  { key: 'mar', label: 'M' },
  { key: 'mie', label: 'M' },
  { key: 'jue', label: 'J' },
  { key: 'vie', label: 'V' },
  { key: 'sab', label: 'S' },
  { key: 'dom', label: 'D' },
]

export const HOURS = Array.from({ length: 19 }, (_, i) => i + 6) // 6 a 24

export const cellKey = (day, hour) => `${day}|${hour}`

function seedBlock(cells, day, startHour, lines, color) {
  lines.forEach((line, i) => {
    cells[cellKey(day, startHour + i)] = { text: line, color }
  })
}

// ---------------------------------------------------------------
// Cronograma teórico (semilla inicial, copiado de la planilla)
// ---------------------------------------------------------------
export function buildTheoreticalSchedule() {
  const cells = {}

  for (const day of ['lun', 'mar', 'mie', 'jue', 'vie']) {
    seedBlock(cells, day, 6, ['DESPERTARSE 6:30'], 'wake')
  }
  for (const day of ['lun', 'mar', 'jue', 'vie']) {
    seedBlock(cells, day, 7, ['Trabajar', '', '', '', '', '', ''], 'work')
  }

  // Lunes
  seedBlock(cells, 'lun', 17, ['Epro', '4D1 - 17:20 - 19:45', ''], 'epro')
  seedBlock(cells, 'lun', 21, ['IO 21:25 a 23:00', '4D1'], 'io')

  // Martes
  seedBlock(cells, 'mar', 15, ['Mantenimiento', '5D2', '15:40 - 18:05'], 'mant')
  seedBlock(cells, 'mar', 18, ['Comercio Exterior', '5D1', '18:15 - 20:40'], 'comex')
  seedBlock(cells, 'mar', 21, ['IO 20:40 a 22:20', '4D1'], 'io')

  // Miércoles
  seedBlock(cells, 'mie', 8, ['Control de Gestión', '5D3', '8 - 10:25'], 'cgestion')
  seedBlock(cells, 'mie', 15, ['Manejo de Materiales', '5D3', '14:55 - 17:20'], 'manejo')
  seedBlock(cells, 'mie', 21, ['Epro', '4D1 - 21:00 - 23:05'], 'epro')

  // Jueves
  seedBlock(cells, 'jue', 14, ['TURNO HAIR'], 'none')

  // Viernes
  seedBlock(cells, 'vie', 14, ['Sustentabilidad y Nuevas economías', '13:30 - 15:30'], 'sust')
  seedBlock(cells, 'vie', 18, ['Innovación estratégica 18:00 a 20:00hs', '5D1'], 'innov')

  return cells
}

// ---------------------------------------------------------------
// Seguimiento de materias (Gantt)
// ---------------------------------------------------------------
export const DEFAULT_SUBJECTS = [
  { id: 'evalproy', name: 'Evaluación de proyectos', color: 'epro' },
  { id: 'io', name: 'Investigación Operativa', color: 'io' },
  { id: 'comex', name: 'Comercio Exterior', color: 'work' },
  { id: 'mant', name: 'Mantenimiento', color: 'gold' },
  { id: 'manejo', name: 'Manejo de Materiales', color: 'cgestion' },
  { id: 'cgestion', name: 'Control de Gestión', color: 'orange' },
  { id: 'sust', name: 'Sustentabilidad y Nuevas economías', color: 'mauve' },
  { id: 'innov', name: 'Innovación estratégica', color: 'innov' },
  { id: 'tesis', name: 'TESIS', color: 'tesis' },
]

// Fechas iniciales: del 8 de junio al 31 de julio (formato M-D)
export function buildDefaultDates() {
  const dates = []
  for (let d = 8; d <= 30; d++) dates.push(`6-${d}`)
  for (let d = 1; d <= 31; d++) dates.push(`7-${d}`)
  return dates
}

// Marcas precargadas de la planilla: clave `${subjectId}|${fecha}`
export const DEFAULT_MARKS = {
  'evalproy|6-22': { label: 'P', color: 'epro' },
  'io|6-16': { label: 'P', color: 'io' },
  'comex|6-9': { label: 'TP1', color: 'work' },
  'comex|6-11': { label: 'RU', color: 'work' },
  'comex|6-23': { label: 'EXP', color: 'work' },
  'comex|6-30': { label: 'P', color: 'work' },
  'mant|6-30': { label: 'P', color: 'gold' },
  'cgestion|6-24': { label: 'P', color: 'orange' },
  'sust|6-19': { label: 'Tp', color: 'mauve' },
}

export const MARK_PRESETS = ['P', 'TP', 'TP1', 'TP2', 'RU', 'EXP', 'Tp', 'FINAL']

// ---------------------------------------------------------------
// Módulo laboral
// ---------------------------------------------------------------
export const WORK_AREAS = [
  { id: 'produccion', name: 'Producción', boss: 'Barbi', accent: '#16a34a' },
  { id: 'mantenimiento', name: 'Mantenimiento', boss: 'Pablo', accent: '#0891b2' },
  { id: 'gerencia', name: 'Gerencia', boss: 'Enzo', accent: '#7c3aed' },
]
