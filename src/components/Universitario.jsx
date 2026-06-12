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
      <div className="flex gap-1 border-b border-slate-300 mb-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-colors ${
              tab === id
                ? 'bg-white border-slate-300 text-slate-900 -mb-px'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
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
