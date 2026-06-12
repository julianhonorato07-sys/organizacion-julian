import { useState, useEffect } from 'react'

// Estado persistido en localStorage: lee al montar, guarda en cada cambio.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch (e) {
      console.warn(`No se pudo leer "${key}" de localStorage`, e)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn(`No se pudo guardar "${key}" en localStorage`, e)
    }
  }, [key, value])

  return [value, setValue]
}
