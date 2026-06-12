import { useState } from 'react'
import { Plus, Trash2, StickyNote, User, CheckCircle2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { WORK_AREAS } from '../data/defaults'

const emptyTasks = () => ({ produccion: [], mantenimiento: [], gerencia: [] })

export default function Laboral() {
  const [tasks, setTasks] = useLocalStorage('laboral-tareas', emptyTasks)

  const updateArea = (areaId, updater) => {
    setTasks((prev) => ({ ...prev, [areaId]: updater(prev[areaId] ?? []) }))
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {WORK_AREAS.map((area) => (
        <AreaBoard
          key={area.id}
          area={area}
          tasks={tasks[area.id] ?? []}
          onChange={(updater) => updateArea(area.id, updater)}
        />
      ))}
    </div>
  )
}

function AreaBoard({ area, tasks, onChange }) {
  const [draft, setDraft] = useState('')
  const pending = tasks.filter((t) => !t.done).length

  const addTask = () => {
    const text = draft.trim()
    if (!text) return
    onChange((prev) => [
      ...prev,
      { id: Date.now(), text, done: false, notes: '', showNotes: false },
    ])
    setDraft('')
  }

  const patchTask = (id, patch) =>
    onChange((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const removeTask = (id) => onChange((prev) => prev.filter((t) => t.id !== id))

  return (
    <section className="glass rounded-2xl flex flex-col overflow-hidden">
      <header
        className="px-4 py-3 text-white flex items-center justify-between border-b border-white/10"
        style={{ background: `linear-gradient(135deg, ${area.accent}cc, ${area.accent}44)` }}
      >
        <div>
          <h2 className="font-tech font-bold leading-tight uppercase tracking-wide">{area.name}</h2>
          <p className="text-xs opacity-90 flex items-center gap-1">
            <User size={12} /> Reporta: {area.boss}
          </p>
        </div>
        <span className="text-xs font-bold bg-black/25 border border-white/20 rounded-full px-2.5 py-1">
          {pending} pendiente{pending === 1 ? '' : 's'}
        </span>
      </header>

      <div className="p-3 border-b border-white/5 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Nueva tarea..."
          className="flex-1 bg-[#0b1226] border border-[#27365c] rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={addTask}
          className="px-3 rounded-lg text-white hover:opacity-85 transition-opacity"
          style={{ backgroundColor: area.accent }}
          title="Agregar tarea"
        >
          <Plus size={18} />
        </button>
      </div>

      <ul className="flex-1 divide-y divide-white/5">
        {tasks.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-slate-500">
            Sin tareas. Agregá la primera arriba.
          </li>
        )}
        {tasks.map((task) => (
          <li key={task.id} className="px-3 py-2.5">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={(e) => patchTask(task.id, { done: e.target.checked })}
                className="mt-1 h-4 w-4 accent-cyan-400 cursor-pointer"
              />
              <span
                className={`flex-1 text-sm leading-snug ${
                  task.done ? 'line-through text-slate-600' : 'text-slate-200'
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => patchTask(task.id, { showNotes: !task.showNotes })}
                title="Notas / detalles técnicos"
                className={`shrink-0 transition-colors ${
                  task.notes || task.showNotes ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'
                }`}
              >
                <StickyNote size={16} />
              </button>
              <button
                onClick={() => removeTask(task.id)}
                title="Eliminar tarea"
                className="shrink-0 text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {task.showNotes && (
              <textarea
                value={task.notes}
                onChange={(e) => patchTask(task.id, { notes: e.target.value })}
                placeholder="Notas o detalles técnicos..."
                rows={2}
                className="mt-2 w-full bg-[#0b1226] border border-amber-400/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60"
              />
            )}
          </li>
        ))}
      </ul>

      {tasks.length > 0 && tasks.every((t) => t.done) && (
        <p className="px-4 py-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5 border-t border-white/5">
          <CheckCircle2 size={14} /> ¡Todo completado!
        </p>
      )}
    </section>
  )
}
