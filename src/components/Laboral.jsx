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
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <header
        className="px-4 py-3 rounded-t-xl text-white flex items-center justify-between"
        style={{ backgroundColor: area.accent }}
      >
        <div>
          <h2 className="font-bold leading-tight">{area.name}</h2>
          <p className="text-xs opacity-90 flex items-center gap-1">
            <User size={12} /> Reporta: {area.boss}
          </p>
        </div>
        <span className="text-xs font-bold bg-white/20 rounded-full px-2.5 py-1">
          {pending} pendiente{pending === 1 ? '' : 's'}
        </span>
      </header>

      <div className="p-3 border-b border-slate-100 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Nueva tarea..."
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addTask}
          className="px-3 rounded-lg text-white hover:opacity-90"
          style={{ backgroundColor: area.accent }}
          title="Agregar tarea"
        >
          <Plus size={18} />
        </button>
      </div>

      <ul className="flex-1 divide-y divide-slate-100">
        {tasks.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-slate-400">
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
                className="mt-1 h-4 w-4 accent-emerald-600 cursor-pointer"
              />
              <span
                className={`flex-1 text-sm leading-snug ${
                  task.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => patchTask(task.id, { showNotes: !task.showNotes })}
                title="Notas / detalles técnicos"
                className={`shrink-0 ${
                  task.notes || task.showNotes ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                }`}
              >
                <StickyNote size={16} />
              </button>
              <button
                onClick={() => removeTask(task.id)}
                title="Eliminar tarea"
                className="shrink-0 text-slate-300 hover:text-red-500"
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
                className="mt-2 w-full border border-slate-200 bg-amber-50/50 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            )}
          </li>
        ))}
      </ul>

      {tasks.length > 0 && tasks.every((t) => t.done) && (
        <p className="px-4 py-2 text-xs text-emerald-600 font-semibold flex items-center gap-1.5 border-t border-slate-100">
          <CheckCircle2 size={14} /> ¡Todo completado!
        </p>
      )}
    </section>
  )
}
