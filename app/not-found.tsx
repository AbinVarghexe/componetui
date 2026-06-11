import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="app-shell flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center text-center">
        <div className="surface-panel rounded-panel p-8 sm:p-12" style={{ maxWidth: '32rem' }}>
          <FileQuestion
            size={56}
            strokeWidth={1.5}
            style={{ color: 'var(--foreground-muted)', margin: '0 auto' }}
          />
          <h1 className="text-display-md mt-6 text-[var(--foreground)]">
            404
          </h1>
          <p className="text-body-md mt-2 text-ui-muted">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="button-primary button-pill text-button">
              Back to Home
            </Link>
            <Link href="/preview" className="button-secondary button-pill text-button">
              Browse Components
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
