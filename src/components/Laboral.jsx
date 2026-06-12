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
      <header className="px-4 py-3 flex items-center justify-between border-b border-[#222226] bg-[#19191c]">
        <div>
          <h2 className="font-bold leading-tight text-zinc-100 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: area.accent }}
            />
            {area.name}
          </h2>
          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
            <User size={11} /> Reporta: {area.boss}
          </p>
        </div>
        <span className="text-xs font-semibold text-zinc-300 bg-[#27272a] rounded-full px-2.5 py-1">
          {pending} pendiente{pending === 1 ? '' : 's'}
        </span>
      </header>

      <div className="p-3 border-b border-[#1e1e22] flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Nueva tarea..."
          className="flex-1 bg-[#101012] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400"
        />
        <button
          onClick={addTask}
          className="px-3 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors"
          title="Agregar tarea"
        >
          <Plus size={17} />
        </button>
      </div>

      <ul className="flex-1 divide-y divide-[#1e1e22]">
        {tasks.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-zinc-600">
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
                className="mt-1 h-4 w-4 accent-emerald-500 cursor-pointer"
              />
              <span
                className={`flex-1 text-sm leading-snug ${
                  task.done ? 'line-through text-zinc-600' : 'text-zinc-200'
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => patchTask(task.id, { showNotes: !task.showNotes })}
                title="Notas / detalles técnicos"
                className={`shrink-0 transition-colors ${
                  task.notes || task.showNotes ? 'text-amber-400' : 'text-zinc-600 hover:text-amber-400'
                }`}
              >
                <StickyNote size={16} />
              </button>
              <button
                onClick={() => removeTask(task.id)}
                title="Eliminar tarea"
                className="shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
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
                className="mt-2 w-full bg-[#101012] border border-[#2a2a2e] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60"
              />
            )}
          </li>
        ))}
      </ul>

      {tasks.length > 0 && tasks.every((t) => t.done) && (
        <p className="px-4 py-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5 border-t border-[#1e1e22]">
          <CheckCircle2 size={14} /> ¡Todo completado!
        </p>
      )}
    </section>
  )
}
