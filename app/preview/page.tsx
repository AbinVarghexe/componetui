"use client"
import React from 'react'
import Link from 'next/link'
import { sidebarSections } from './components/sidebar-data'

export default function PreviewIndexPage() {
  return (
    <div className="app-shell" style={{ maxWidth: '64rem' }}>
      <div className="border-b border-[var(--border-subtle)] pb-5">
        <p className="text-caption uppercase tracking-[0.28em] text-ui-muted">
          Gamin UI Registry
        </p>
        <h1 className="text-display-md mt-2 text-[var(--foreground)] sm:text-display-lg">
          Component Index
        </h1>
        <p className="text-body-sm mt-2 max-w-2xl text-ui-muted sm:text-body-md">
          Browse all available components, animations, and backgrounds. Click any item to view its live preview, usage examples, and installation instructions.
        </p>
      </div>

      {sidebarSections.map((section) => {
        const SectionIcon = section.Icon
        return (
        <div key={section.id} className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <SectionIcon size={20} style={{ color: 'var(--foreground-muted)' }} />
            <h2 className="text-title-lg text-[var(--foreground)]">{section.label}</h2>
          </div>

          <div className="component-gallery">
            {section.items.map((item) => {
              const href = `/preview/${item.slug}`
              return (
                <Link key={item.slug} href={href} className="gallery-card">
                  <span
                    className={`gallery-card-badge ${
                      item.status === 'available'
                        ? 'gallery-card-badge-available'
                        : 'gallery-card-badge-coming'
                    }`}
                  >
                    {item.status === 'available' ? 'Available' : 'Coming Soon'}
                  </span>
                  <span className="gallery-card-title">{item.label}</span>
                  <span className="gallery-card-description">
                    {item.status === 'available'
                      ? `Preview and install the ${item.label} component with one command.`
                      : `The ${item.label} component is currently in development.`}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )})}
    </div>
  )
}
