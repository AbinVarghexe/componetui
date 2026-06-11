import type { LucideIcon } from 'lucide-react'
import { BookOpen, Type, Sparkles, Puzzle, Palette } from 'lucide-react'

export type SidebarItem = {
  label: string
  slug: string
  status: 'available' | 'coming-soon'
}

export type SidebarSection = {
  id: string
  label: string
  Icon: LucideIcon
  items: SidebarItem[]
}

export const sidebarSections: SidebarSection[] = [
  {
    id: 'get-started',
    label: 'Get Started',
    Icon: BookOpen,
    items: [
      { label: 'Introduction', slug: 'introduction', status: 'available' },
      { label: 'Installation', slug: 'installation', status: 'available' },
      { label: 'MCP', slug: 'mcp', status: 'available' },
      { label: 'In Text', slug: 'in-text', status: 'available' },
    ],
  },
  {
    id: 'text-animation',
    label: 'Text Animation',
    Icon: Type,
    items: [
      { label: 'Split Text', slug: 'split-text', status: 'coming-soon' },
      { label: 'Typewriter', slug: 'typewriter', status: 'coming-soon' },
      { label: 'Gradient Text', slug: 'gradient-text', status: 'coming-soon' },
    ],
  },
  {
    id: 'animation',
    label: 'Animation',
    Icon: Sparkles,
    items: [
      { label: 'Animated Button', slug: 'animated-button', status: 'coming-soon' },
      { label: 'Animated Card', slug: 'animated-card', status: 'coming-soon' },
      { label: 'Scroll Reveal', slug: 'scroll-reveal', status: 'coming-soon' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    Icon: Puzzle,
    items: [
      { label: 'Button', slug: 'button', status: 'available' },
      { label: 'Navbar', slug: 'navbar', status: 'coming-soon' },
      { label: 'Hero Modern', slug: 'hero-modern', status: 'available' },
      { label: 'Pricing Card', slug: 'pricing-card', status: 'available' },
      { label: 'Folder', slug: 'folder', status: 'coming-soon' },
    ],
  },
  {
    id: 'background',
    label: 'Background',
    Icon: Palette,
    items: [
      { label: 'Anti-gravity', slug: 'anti-gravity-background', status: 'coming-soon' },
      { label: 'Silk', slug: 'silk-background', status: 'coming-soon' },
      { label: 'Aurora', slug: 'aurora-background', status: 'coming-soon' },
    ],
  },
]

/** Flat list of all items for search */
export function getAllItems(): (SidebarItem & { sectionLabel: string })[] {
  return sidebarSections.flatMap((section) =>
    section.items.map((item) => ({ ...item, sectionLabel: section.label }))
  )
}
