'use client'
import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function PreviewNotFound() {
  return (
    <div style={{ maxWidth: '48rem' }}>
      <div className="coming-soon-card" style={{ minHeight: '20rem' }}>
        <SearchX
          size={48}
          strokeWidth={1.5}
          style={{ opacity: 0.5, color: 'var(--foreground-muted)' }}
        />
        <span className="coming-soon-title">Page Not Found</span>
        <span className="coming-soon-description">
          This component or page does not exist in the registry. It may have been removed or the URL is incorrect.
        </span>
        <div className="mt-2 flex gap-3">
          <Link href="/preview" className="button-primary button-pill text-button">
            Component Index
          </Link>
        </div>
      </div>
    </div>
  )
}
