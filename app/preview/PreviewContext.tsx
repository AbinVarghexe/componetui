'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type Language = 'typescript' | 'javascript'
type Styling = 'css' | 'tailwind'

type PreviewContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  styling: Styling
  setStyling: (style: Styling) => void
  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
}

const PreviewContext = createContext<PreviewContextValue | null>(null)

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('typescript')
  const [styling, setStylingState] = useState<Styling>('css')
  const [searchOpen, setSearchOpen] = useState(false)

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('gamin-ui-language') as Language | null
      const savedStyle = localStorage.getItem('gamin-ui-styling') as Styling | null
      if (savedLang === 'typescript' || savedLang === 'javascript') setLanguageState(savedLang)
      if (savedStyle === 'css' || savedStyle === 'tailwind') setStylingState(savedStyle)
    } catch {
      // localStorage not available
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try { localStorage.setItem('gamin-ui-language', lang) } catch { /* noop */ }
  }, [])

  const setStyling = useCallback((style: Styling) => {
    setStylingState(style)
    try { localStorage.setItem('gamin-ui-styling', style) } catch { /* noop */ }
  }, [])

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const toggleSearch = useCallback(() => setSearchOpen((v) => !v), [])

  // Global Ctrl+K handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <PreviewContext.Provider
      value={{
        language,
        setLanguage,
        styling,
        setStyling,
        searchOpen,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </PreviewContext.Provider>
  )
}

export function usePreview() {
  const ctx = useContext(PreviewContext)
  if (!ctx) throw new Error('usePreview must be used within <PreviewProvider>')
  return ctx
}
