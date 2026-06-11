import type { Metadata } from 'next'
import { PreviewProvider } from './PreviewContext'
import PreviewNavbar from './components/PreviewNavbar'
import PreviewSidebar from './components/PreviewSidebar'
import SearchModal from './components/SearchModal'

export const metadata: Metadata = {
  title: 'Preview — Gamin UI Registry',
  description: 'Browse, preview, and install Gamin UI components. Explore text animations, animated components, backgrounds, and more.',
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PreviewProvider>
      <div className="preview-layout">
        <PreviewNavbar />
        <PreviewSidebar />
        <main className="preview-layout-main">
          {children}
        </main>
        <SearchModal />
      </div>
    </PreviewProvider>
  )
}
