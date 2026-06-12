import { GraduationCap, Factory, ClipboardList, TrendingUp } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Universitario from './components/Universitario'
import Laboral from './components/Laboral'
import Inversiones from './components/Inversiones'
import FraseMotivadora from './components/FraseMotivadora'

const MODULES = [
  { id: 'universitario', label: 'Universitario', icon: GraduationCap },
  { id: 'laboral', label: 'Laboral', icon: Factory },
  { id: 'inversiones', label: 'Inversiones', icon: TrendingUp },
]

export default function App() {
  const [active, setActive] = useLocalStorage('app-modulo', 'universitario')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={26} className="text-amber-400" />
            <h1 className="text-lg font-bold tracking-wide">
              Organización de Julian
            </h1>
          </div>
          <nav className="flex gap-2 ml-auto">
            {MODULES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active === id
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <FraseMotivadora />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-5">
        {active === 'universitario' && <Universitario />}
        {active === 'laboral' && <Laboral />}
        {active === 'inversiones' && <Inversiones />}
      </main>

      <footer className="text-center text-xs text-slate-400 py-3">
        Los datos se guardan automáticamente en este navegador (localStorage)
      </footer>
    </div>
  )
}
