import { useState } from 'react'
import { Quote, RefreshCw } from 'lucide-react'
import { QUOTES } from '../data/quotes'

// Índice base según el día del año: la frase rota sola cada día
function dailyIndex() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - start) / 86400000)
  return dayOfYear % QUOTES.length
}

export default function FraseMotivadora() {
  const [offset, setOffset] = useState(0)
  const quote = QUOTES[(dailyIndex() + offset) % QUOTES.length]

  return (
    <div className="border-b border-[#1f1f23]">
      <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center gap-2.5">
        <Quote size={14} className="text-zinc-500 shrink-0" />
        <p className="text-sm text-zinc-400 italic font-medium flex-1">
          {quote}
        </p>
        <button
          onClick={() => setOffset((o) => o + 1)}
          title="Otra frase"
          className="text-zinc-600 hover:text-white shrink-0 transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  )
}
