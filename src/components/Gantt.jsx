import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  COLORS,
  DEFAULT_SUBJECTS,
  DEFAULT_MARKS,
  MARK_PRESETS,
  buildDefaultDates,
} from '../data/defaults'

const markKey = (subjectId, date) => `${subjectId}|${date}`

// Los encabezados de domingo se resaltan en rojo, como en la planilla
function isSunday(dateStr) {
  const [month, day] = dateStr.split('-').map(Number)
  return new Date(new Date().getFullYear(), month - 1, day).getDay() === 0
}

export default function Gantt() {
  const [subjects, setSubjects] = useLocalStorage('gantt-materias', DEFAULT_SUBJECTS)
  const [dates, setDates] = useLocalStorage('gantt-fechas', buildDefaultDates)
  const [notas, setNotas] = useLocalStorage('gantt-notas', {})
  const [marks, setMarks] = useLocalStorage('gantt-marcas', DEFAULT_MARKS)
  const [editing, setEditing] = useState(null) // { subjectId, date }

  const addDate = () => {
    const last = dates[dates.length - 1]
    let [month, day] = last.split('-').map(Number)
    const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate()
    if (day >= daysInMonth) {
      month = month === 12 ? 1 : month + 1
      day = 1
    } else {
      day += 1
    }
    setDates([...dates, `${month}-${day}`])
  }

  const removeDate = (date) => {
    const marksInColumn = Object.keys(marks).filter((k) => k.endsWith(`|${date}`))
    const warning =
      marksInColumn.length > 0
        ? `La columna ${date} tiene ${marksInColumn.length} marca(s) que también se borrarán. ¿Eliminar?`
        : `¿Eliminar la columna ${date}?`
    if (!confirm(warning)) return
    setDates(dates.filter((d) => d !== date))
    if (marksInColumn.length > 0) {
      setMarks((prev) =>
        Object.fromEntries(Object.entries(prev).filter(([k]) => !k.endsWith(`|${date}`))),
      )
    }
  }

  const addSubject = () => {
    const name = prompt('Nombre de la nueva materia:')
    if (!name?.trim()) return
    setSubjects([
      ...subjects,
      { id: `m${Date.now()}`, name: name.trim(), color: 'tesis' },
    ])
  }

  const removeSubject = (id) => {
    const subject = subjects.find((s) => s.id === id)
    if (!confirm(`¿Eliminar "${subject?.name}" y todas sus marcas?`)) return
    setSubjects(subjects.filter((s) => s.id !== id))
    setMarks((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([k]) => !k.startsWith(`${id}|`))),
    )
    setNotas((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const saveMark = (value) => {
    const key = markKey(editing.subjectId, editing.date)
    setMarks((prev) => {
      const next = { ...prev }
      if (value === null) delete next[key]
      else next[key] = value
      return next
    })
    setEditing(null)
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="font-semibold text-zinc-100">Materias / Objetivos</h2>
        <button
          onClick={addSubject}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 border border-[#2a2a2e] rounded-full hover:text-white hover:border-zinc-500 transition-colors"
        >
          <Plus size={13} /> Materia
        </button>
        <button
          onClick={addDate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 border border-[#2a2a2e] rounded-full hover:text-white hover:border-zinc-500 transition-colors"
        >
          <Plus size={13} /> Fecha
        </button>
        <span className="text-xs text-zinc-600 ml-auto">
          Clic en una celda para marcar P / TP / RU / EXP · pasá el mouse sobre una fecha para eliminarla
        </span>
      </div>

      <div className="overflow-x-auto scroll-slim max-h-[70vh] overflow-y-auto">
        <table className="border-collapse text-sm">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 bg-[#161618] text-zinc-300 border border-[#222226] px-3 py-2 min-w-[230px] text-left text-sm font-semibold">
                Materias / Objetivos
              </th>
              <th className="sticky left-[230px] z-30 bg-[#161618] text-zinc-300 border border-[#222226] px-2 py-2 min-w-[90px] text-sm font-semibold">
                Notas
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  className={`relative border border-[#222226] px-1 py-2 min-w-[48px] text-xs font-bold group/fecha ${
                    isSunday(d) ? 'bg-[#2a1215] text-red-400' : 'bg-[#161618] text-zinc-500'
                  }`}
                >
                  {d}
                  <button
                    onClick={() => removeDate(d)}
                    title={`Eliminar columna ${d}`}
                    className={`absolute top-0 right-0 p-0.5 rounded-bl opacity-0 group-hover/fecha:opacity-100 ${
                      isSunday(d)
                        ? 'text-red-400 hover:bg-red-500/20'
                        : 'text-zinc-500 hover:text-red-400 hover:bg-white/5'
                    }`}
                  >
                    <X size={11} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => {
              const subjectColor = COLORS[subject.color] ?? COLORS.tesis
              return (
                <tr key={subject.id} className="group">
                  <td
                    className="sticky left-0 z-10 border border-[#222226] px-3 py-1.5 font-bold text-xs min-w-[230px]"
                    style={{ backgroundColor: subjectColor.bg, color: subjectColor.text }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{subject.name}</span>
                      <button
                        onClick={() => removeSubject(subject.id)}
                        title="Eliminar materia"
                        className="opacity-0 group-hover:opacity-70 hover:!opacity-100 shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="sticky left-[230px] z-10 border border-[#222226] bg-[#121214] p-0 min-w-[90px]">
                    <input
                      value={notas[subject.id] ?? ''}
                      onChange={(e) =>
                        setNotas((prev) => ({ ...prev, [subject.id]: e.target.value }))
                      }
                      placeholder="—"
                      className="w-full h-full bg-transparent px-2 py-1.5 text-center text-xs font-semibold text-zinc-100 focus:outline-none focus:bg-white/5"
                    />
                  </td>
                  {dates.map((date) => {
                    const mark = marks[markKey(subject.id, date)]
                    const markColor = mark ? (COLORS[mark.color] ?? subjectColor) : null
                    return (
                      <td
                        key={date}
                        onClick={() => setEditing({ subjectId: subject.id, date })}
                        className="border border-[#222226] text-center text-xs font-bold cursor-pointer h-8 hover:outline hover:outline-2 hover:outline-zinc-400"
                        style={
                          mark
                            ? { backgroundColor: markColor.bg, color: markColor.text }
                            : undefined
                        }
                      >
                        {mark?.label || ''}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <MarkEditor
          mark={marks[markKey(editing.subjectId, editing.date)]}
          subject={subjects.find((s) => s.id === editing.subjectId)}
          date={editing.date}
          onSave={saveMark}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function MarkEditor({ mark, subject, date, onSave, onClose }) {
  const [label, setLabel] = useState(mark?.label ?? 'P')
  const [color, setColor] = useState(mark?.color ?? subject?.color ?? 'red')

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="glass rounded-2xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-zinc-100 text-sm">
            {subject?.name} — {date}
          </h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <label className="block text-xs font-medium text-zinc-500 mb-1">Etiqueta</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {MARK_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setLabel(preset)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                label === preset
                  ? 'bg-white text-black border-white'
                  : 'border-[#2a2a2e] text-zinc-500 hover:text-white hover:border-zinc-500'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave({ label, color })}
          placeholder="Etiqueta personalizada"
          className="w-full bg-[#101012] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm text-zinc-100 mb-3 focus:outline-none focus:border-zinc-400"
        />

        <label className="block text-xs font-medium text-zinc-500 mb-1">Color</label>
        <div className="grid grid-cols-8 gap-1.5 mb-4">
          {Object.entries(COLORS).map(([key, c]) => (
            <button
              key={key}
              title={c.label}
              onClick={() => setColor(key)}
              className={`h-7 rounded-md border ${
                color === key ? 'ring-2 ring-white border-white' : 'border-[#2a2a2e]'
              }`}
              style={{ backgroundColor: c.bg }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSave({ label, color })}
            className="flex-1 bg-white text-black rounded-lg py-2 text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            Guardar
          </button>
          {mark && (
            <button
              onClick={() => onSave(null)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 size={15} /> Quitar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
