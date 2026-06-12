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
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
      <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center gap-2.5">
        <Quote size={15} className="text-amber-500 shrink-0" />
        <p className="text-sm text-amber-900 italic font-medium flex-1">
          {quote}
        </p>
        <button
          onClick={() => setOffset((o) => o + 1)}
          title="Otra frase"
          className="text-amber-400 hover:text-amber-600 shrink-0"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  )
}
