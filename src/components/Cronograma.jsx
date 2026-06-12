import { useState } from 'react'
import { BookOpen, CalendarCheck, RotateCcw, Trash2, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COLORS, DAYS, HOURS, cellKey, buildTheoreticalSchedule } from '../data/defaults'

// Número de semana ISO y rango lunes-domingo de la semana actual
function getWeekInfo() {
  const now = new Date()
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)

  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() || 7) - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (x) => x.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  return { week, range: `${fmt(monday)} al ${fmt(sunday)}` }
}

export default function Cronograma() {
  const [teorico, setTeorico] = useLocalStorage('crono-teorico', buildTheoreticalSchedule)
  const [practico, setPractico] = useLocalStorage('crono-practico', buildTheoreticalSchedule)
  const [mode, setMode] = useLocalStorage('crono-modo', 'teorico')
  const [editing, setEditing] = useState(null) // { day, hour }
  const [dragging, setDragging] = useState(null)

  const isTeorico = mode === 'teorico'
  const cells = isTeorico ? teorico : practico
  const setCells = isTeorico ? setTeorico : setPractico
  const { week, range } = getWeekInfo()

  const updateCell = (day, hour, value) => {
    setCells((prev) => {
      const next = { ...prev }
      if (value === null) delete next[cellKey(day, hour)]
      else next[cellKey(day, hour)] = value
      return next
    })
  }

  const handleDrop = (day, hour) => {
    if (!dragging) return
    const fromKey = cellKey(dragging.day, dragging.hour)
    const toKey = cellKey(day, hour)
    if (fromKey === toKey) return
    setCells((prev) => {
      const next = { ...prev }
      const moved = next[fromKey]
      if (!moved) return prev
      delete next[fromKey]
      next[toKey] = moved
      return next
    })
    setDragging(null)
  }

  const resetPractico = () => {
    if (confirm('¿Reiniciar el cronograma práctico copiando el teórico? Se perderán los cambios de esta semana.')) {
      setPractico({ ...teorico })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Toggle teórico / práctico */}
        <div className="flex rounded-lg overflow-hidden border border-slate-300">
          <button
            onClick={() => setMode('teorico')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
              isTeorico ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={15} /> Teórico
          </button>
          <button
            onClick={() => setMode('practico')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
              !isTeorico ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck size={15} /> Práctico (semana actual)
          </button>
        </div>

        {!isTeorico && (
          <button
            onClick={resetPractico}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw size={14} /> Reiniciar semana desde el teórico
          </button>
        )}

        <span className="text-xs text-slate-400 ml-auto">
          Clic en una celda para editar · arrastrá un bloque para moverlo
        </span>
      </div>

      <div className="overflow-x-auto scroll-slim">
        <table className="w-full border-collapse min-w-[900px] table-fixed">
          <thead>
            <tr>
              <th className="w-20 border border-slate-300 bg-white"></th>
              <th
                colSpan={DAYS.length}
                className="border border-slate-300 bg-[#c27ba0] text-white text-sm font-bold py-1.5 tracking-wide"
              >
                SEMANA {week} · {range}
                {!isTeorico && ' · (semana en curso)'}
              </th>
            </tr>
            <tr>
              <th className="w-20 border border-slate-300 bg-[#c27ba0] text-white text-xs py-2 px-1">
                HORAS / DÍAS
              </th>
              {DAYS.map(({ key, label }) => (
                <th key={key} className="border border-slate-300 bg-[#c27ba0] text-white text-sm py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="border border-slate-300 bg-slate-50 text-center text-xs font-bold text-slate-600 py-1">
                  {hour}
                </td>
                {DAYS.map(({ key: day }) => {
                  const cell = cells[cellKey(day, hour)]
                  const color = COLORS[cell?.color] ?? COLORS.none
                  return (
                    <td
                      key={day}
                      draggable={!!cell}
                      onClick={() => setEditing({ day, hour })}
                      onDragStart={() => setDragging({ day, hour })}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(day, hour)}
                      className="border border-slate-300 text-center text-[11px] font-semibold leading-tight px-1 py-0.5 h-7 cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 select-none overflow-hidden"
                      style={cell ? { backgroundColor: color.bg, color: color.text } : undefined}
                      title={cell?.text || ''}
                    >
                      {cell?.text || ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <CellEditor
          cell={cells[cellKey(editing.day, editing.hour)]}
          dayLabel={DAYS.find((d) => d.key === editing.day)?.label}
          hour={editing.hour}
          onSave={(value) => {
            updateCell(editing.day, editing.hour, value)
            setEditing(null)
          }}
          onDelete={() => {
            updateCell(editing.day, editing.hour, null)
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function CellEditor({ cell, dayLabel, hour, onSave, onDelete, onClose }) {
  const [text, setText] = useState(cell?.text ?? '')
  const [color, setColor] = useState(cell?.color ?? 'work')

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">
            {dayLabel} — {hour}:00
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <label className="block text-xs font-semibold text-slate-500 mb-1">Texto del bloque</label>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave({ text, color })}
          placeholder="Ej: Epro 4D1 - 17:20"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-xs font-semibold text-slate-500 mb-1">Color</label>
        <div className="grid grid-cols-8 gap-1.5 mb-4">
          {Object.entries(COLORS).map(([key, c]) => (
            <button
              key={key}
              title={c.label}
              onClick={() => setColor(key)}
              className={`h-7 rounded border ${
                color === key ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-300'
              }`}
              style={{ backgroundColor: c.bg }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSave({ text, color })}
            className="flex-1 bg-slate-800 text-white rounded-lg py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Guardar
          </button>
          {cell && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={15} /> Borrar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
