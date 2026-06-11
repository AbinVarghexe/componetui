'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { sidebarSections } from './sidebar-data'

export default function PreviewSidebar() {
  const pathname = usePathname()

  // All sections open by default
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sidebarSections.map((s) => s.id))
  )

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function isActive(slug: string) {
    if (slug === 'in-text') {
      return pathname === '/preview'
    }
    return pathname === `/preview/${slug}`
  }

  return (
    <aside className="preview-layout-sidebar" id="preview-sidebar">
      <div style={{ padding: 'var(--space-sm) 0' }}>
        {sidebarSections.map((section) => {
          const isOpen = openSections.has(section.id)
          const SectionIcon = section.Icon
          return (
            <div key={section.id} className="sidebar-section">
              <button
                className="sidebar-section-header"
                onClick={() => toggleSection(section.id)}
                type="button"
                aria-expanded={isOpen}
              >
                <SectionIcon size={14} className="section-icon" />
                <span>{section.label}</span>
                <ChevronRight
                  size={12}
                  className={`section-chevron ${isOpen ? 'section-chevron-open' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="sidebar-section-items">
                  {section.items.map((item) => {
                    const active = isActive(item.slug)
                    const href = item.slug === 'in-text' ? '/preview' : `/preview/${item.slug}`
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        className={`sidebar-item-link ${active ? 'sidebar-item-link-active' : ''}`}
                      >
                        <span>{item.label}</span>
                        {item.status === 'coming-soon' && (
                          <span className="sidebar-item-badge">Soon</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
