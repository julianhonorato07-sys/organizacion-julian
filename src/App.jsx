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
      <header className="sticky top-0 z-40 bg-[#0c0c0d]/90 backdrop-blur-xl border-b border-[#1f1f23]">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-[#1d1d20] border border-[#2a2a2e]">
              <ClipboardList size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold neon-text">
              Organización de Julian
            </h1>
          </div>
          <nav className="flex gap-1 ml-auto bg-[#161618] border border-[#232328] rounded-full p-1">
            {MODULES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  active === id
                    ? 'bg-[#2e2e33] text-white'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                <Icon size={15} />
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

      <footer className="text-center text-xs text-zinc-600 py-3">
        Los datos se guardan automáticamente en este navegador (localStorage)
      </footer>
    </div>
  )
}
