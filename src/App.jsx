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
      <header className="sticky top-0 z-40 bg-[#070d1f]/85 backdrop-blur-xl border-b border-cyan-400/10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-400/30">
              <ClipboardList size={22} className="text-cyan-300" />
            </div>
            <h1 className="text-xl font-bold neon-text">
              Organización de Julian
            </h1>
          </div>
          <nav className="flex gap-2 ml-auto">
            {MODULES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  active === id
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white glow-cyan'
                    : 'text-slate-400 border border-slate-700/60 hover:border-cyan-400/40 hover:text-cyan-300'
                }`}
              >
                <Icon size={16} />
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

      <footer className="text-center text-xs text-slate-600 py-3">
        Los datos se guardan automáticamente en este navegador (localStorage)
      </footer>
    </div>
  )
}
