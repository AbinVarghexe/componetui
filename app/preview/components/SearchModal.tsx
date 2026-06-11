'use client'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePreview } from '../PreviewContext'
import { getAllItems, type SidebarItem } from './sidebar-data'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.25 12.5C10.1495 12.5 12.5 10.1495 12.5 7.25C12.5 4.35051 10.1495 2 7.25 2C4.35051 2 2 4.35051 2 7.25C2 10.1495 4.35051 12.5 7.25 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

type SearchableItem = SidebarItem & { sectionLabel: string }

export default function SearchModal() {
  const { searchOpen, closeSearch } = usePreview()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)

  const allItems = useMemo(() => getAllItems(), [])

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems
    const lower = query.toLowerCase()
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.slug.toLowerCase().includes(lower) ||
        item.sectionLabel.toLowerCase().includes(lower)
    )
  }, [query, allItems])

  // Group filtered items by section
  const grouped = useMemo(() => {
    const map = new Map<string, SearchableItem[]>()
    for (const item of filtered) {
      const existing = map.get(item.sectionLabel) || []
      existing.push(item)
      map.set(item.sectionLabel, existing)
    }
    return map
  }, [filtered])

  // Reset state when opening
  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setFocusedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  // Reset focused index when results change
  useEffect(() => {
    setFocusedIndex(0)
  }, [filtered.length])

  const navigateToItem = useCallback(
    (item: SearchableItem) => {
      closeSearch()
      if (item.slug === 'in-text') {
        router.push('/preview')
      } else {
        router.push(`/preview/${item.slug}`)
      }
    },
    [closeSearch, router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filtered[focusedIndex]) {
        e.preventDefault()
        navigateToItem(filtered[focusedIndex])
      }
    },
    [filtered, focusedIndex, navigateToItem]
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) closeSearch()
    },
    [closeSearch]
  )

  if (!searchOpen) return null

  let itemIndex = 0

  return (
    <div className="search-overlay" onClick={handleOverlayClick} id="search-modal">
      <div className="search-panel" role="dialog" aria-label="Search components">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search components, animations, backgrounds…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            id="search-input"
          />
        </div>

        <div className="search-results">
          {filtered.length === 0 ? (
            <div className="search-results-empty">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Array.from(grouped.entries()).map(([section, items]) => (
              <div key={section}>
                <div className="search-result-section">{section}</div>
                {items.map((item) => {
                  const currentIndex = itemIndex++
                  return (
                    <button
                      key={item.slug}
                      className={`search-result-item ${currentIndex === focusedIndex ? 'search-result-item-focused' : ''}`}
                      onClick={() => navigateToItem(item)}
                      onMouseEnter={() => setFocusedIndex(currentIndex)}
                      type="button"
                    >
                      <span>{item.label}</span>
                      {item.status === 'coming-soon' && (
                        <span className="result-badge">Soon</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="search-footer">
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> select</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  )
}
