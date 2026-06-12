import { CalendarDays, GanttChartSquare } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Cronograma from './Cronograma'
import Gantt from './Gantt'

const TABS = [
  { id: 'cronograma', label: 'Cronograma Semanal', icon: CalendarDays },
  { id: 'seguimiento', label: 'Seguimiento de Materias', icon: GanttChartSquare },
]

export default function Universitario() {
  const [tab, setTab] = useLocalStorage('uni-tab', 'cronograma')

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`font-tech flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-lg border transition-all ${
              tab === id
                ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300'
                : 'border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-500'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      {tab === 'cronograma' ? <Cronograma /> : <Gantt />}
    </div>
  )
}
