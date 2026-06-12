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
      <div className="inline-flex gap-1 mb-4 bg-[#161618] border border-[#232328] rounded-full p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
              tab === id
                ? 'bg-[#2e2e33] text-white'
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
      {tab === 'cronograma' ? <Cronograma /> : <Gantt />}
    </div>
  )
}
