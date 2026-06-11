"use client"
import React from 'react'
import { use } from 'react'
import { notFound } from 'next/navigation'
import { Bot, Construction, CheckCircle2 } from 'lucide-react'
import { usePreview } from '../PreviewContext'
import { getAllItems } from '../components/sidebar-data'

/* ── Registry: available components ── */
import Button from '@/registry/button/button'
import HeroModern from '@/registry/hero-modern/hero-modern'
import PricingCard from '@/registry/pricing-card/pricing-card'
import buttonMeta from '@/registry/button/metadata.json'
import heroMeta from '@/registry/hero-modern/metadata.json'
import pricingMeta from '@/registry/pricing-card/metadata.json'

type ComponentMeta = {
  id: string
  name: string
  version: string
  description?: string
  frameworks?: string[]
  dependencies?: string[]
}

type RegistryEntry = {
  Component: React.ComponentType
  meta: ComponentMeta
  examples: {
    typescript: { css: string; tailwind: string }
    javascript: { css: string; tailwind: string }
  }
}

const registryMap: Record<string, RegistryEntry> = {
  button: {
    Component: Button,
    meta: buttonMeta as ComponentMeta,
    examples: {
      typescript: {
        css: `import Button from 'components/button/button'\n\nexport default function App() {\n  return <Button onClick={() => console.log('clicked')}>Click me</Button>\n}`,
        tailwind: `import Button from 'components/button/button'\n\n// Tailwind version uses utility classes\nexport default function App() {\n  return (\n    <button className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50">\n      Click me\n    </button>\n  )\n}`,
      },
      javascript: {
        css: `import Button from 'components/button/button'\n\nexport default function App() {\n  return <Button onClick={() => console.log('clicked')}>Click me</Button>\n}`,
        tailwind: `import Button from 'components/button/button'\n\n// Tailwind version uses utility classes\nexport default function App() {\n  return (\n    <button className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50">\n      Click me\n    </button>\n  )\n}`,
      },
    },
  },
  'hero-modern': {
    Component: HeroModern,
    meta: heroMeta as ComponentMeta,
    examples: {
      typescript: {
        css: `import HeroModern from 'components/hero-modern/hero-modern'\n\ntype Props = {\n  title?: string\n  subtitle?: string\n}\n\nexport default function App({ title, subtitle }: Props) {\n  return <HeroModern title="Build Faster" subtitle="Ship with confidence" />\n}`,
        tailwind: `// Tailwind version\nimport HeroModern from 'components/hero-modern/hero-modern'\n\nexport default function App() {\n  return (\n    <section className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">\n      <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Featured hero</p>\n      <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900">Build Faster</h1>\n      <p className="mx-auto mt-3 max-w-lg text-base text-gray-500">Ship with confidence</p>\n    </section>\n  )\n}`,
      },
      javascript: {
        css: `import HeroModern from 'components/hero-modern/hero-modern'\n\nexport default function App() {\n  return <HeroModern title="Build Faster" subtitle="Ship with confidence" />\n}`,
        tailwind: `// Tailwind version\nimport HeroModern from 'components/hero-modern/hero-modern'\n\nexport default function App() {\n  return (\n    <section className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">\n      <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Featured hero</p>\n      <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900">Build Faster</h1>\n      <p className="mx-auto mt-3 max-w-lg text-base text-gray-500">Ship with confidence</p>\n    </section>\n  )\n}`,
      },
    },
  },
  'pricing-card': {
    Component: PricingCard,
    meta: pricingMeta as ComponentMeta,
    examples: {
      typescript: {
        css: `import PricingCard from 'components/pricing-card/pricing-card'\n\ntype Props = {\n  title?: string\n  price?: string\n}\n\nexport default function App({ title, price }: Props) {\n  return <PricingCard title="Pro" price="$9" />\n}`,
        tailwind: `// Tailwind version\nexport default function App() {\n  return (\n    <div className="w-72 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">\n      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Plan</p>\n      <h3 className="mt-2 text-xl font-semibold text-gray-900">Pro</h3>\n      <p className="mt-3 text-2xl font-semibold text-gray-900">$9<span className="text-base text-gray-500">/mo</span></p>\n      <button className="mt-4 w-full rounded-full bg-gray-900 py-2.5 text-sm font-semibold text-white">Buy</button>\n    </div>\n  )\n}`,
      },
      javascript: {
        css: `import PricingCard from 'components/pricing-card/pricing-card'\n\nexport default function App() {\n  return <PricingCard title="Pro" price="$9" />\n}`,
        tailwind: `// Tailwind version\nexport default function App() {\n  return (\n    <div className="w-72 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">\n      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Plan</p>\n      <h3 className="mt-2 text-xl font-semibold text-gray-900">Pro</h3>\n      <p className="mt-3 text-2xl font-semibold text-gray-900">$9<span className="text-base text-gray-500">/mo</span></p>\n      <button className="mt-4 w-full rounded-full bg-gray-900 py-2.5 text-sm font-semibold text-white">Buy</button>\n    </div>\n  )\n}`,
      },
    },
  },
}

/* ── Static content pages ── */
function IntroductionPage() {
  return (
    <div style={{ maxWidth: '48rem' }}>
      <p className="text-caption uppercase tracking-[0.28em] text-ui-muted">Get Started</p>
      <h1 className="text-display-md mt-2 text-[var(--foreground)] sm:text-display-lg">Introduction</h1>
      <p className="text-body-md mt-4 text-ui-muted leading-7">
        Gamin UI is a curated component registry that delivers production-ready source code directly into your project.
        Instead of installing an npm package, you get editable source files that become part of your codebase.
      </p>
      <div className="surface-card rounded-card card-padding-lg mt-6">
        <h3 className="text-title-sm text-[var(--foreground)]">Why Gamin UI?</h3>
        <ul className="mt-3 space-y-2 text-body-sm text-ui-muted">
          <li className="flex items-start gap-2"><CheckCircle2 size={14} style={{ marginTop: '0.2rem', flexShrink: 0, color: 'var(--color-success)' }} /> Full source code ownership — customize everything</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} style={{ marginTop: '0.2rem', flexShrink: 0, color: 'var(--color-success)' }} /> One-command installation via CLI</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} style={{ marginTop: '0.2rem', flexShrink: 0, color: 'var(--color-success)' }} /> Automatic dependency resolution</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} style={{ marginTop: '0.2rem', flexShrink: 0, color: 'var(--color-success)' }} /> React &amp; Next.js support out of the box</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} style={{ marginTop: '0.2rem', flexShrink: 0, color: 'var(--color-success)' }} /> Apple-inspired design language</li>
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="text-title-sm text-[var(--foreground)]">Quick Start</h3>
        <pre className="code-panel mt-3 px-4 py-4 text-body-sm leading-6">
          <code>npx gamin-ui add button</code>
        </pre>
        <p className="text-body-sm mt-3 text-ui-muted">This will download the Button component source files into your <code className="text-[var(--foreground)]">components/button/</code> directory.</p>
      </div>
    </div>
  )
}

function InstallationPage() {
  return (
    <div style={{ maxWidth: '48rem' }}>
      <p className="text-caption uppercase tracking-[0.28em] text-ui-muted">Get Started</p>
      <h1 className="text-display-md mt-2 text-[var(--foreground)] sm:text-display-lg">Installation</h1>
      <p className="text-body-md mt-4 text-ui-muted leading-7">
        Gamin UI uses a CLI to install components directly into your project. No package installation required.
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-title-sm text-[var(--foreground)]">Add a component</h3>
          <pre className="code-panel mt-3 px-4 py-4 text-body-sm leading-6">
            <code>npx gamin-ui add button</code>
          </pre>
        </div>
        <div>
          <h3 className="text-title-sm text-[var(--foreground)]">Auto-install dependencies</h3>
          <pre className="code-panel mt-3 px-4 py-4 text-body-sm leading-6">
            <code>npx gamin-ui add hero-modern --install</code>
          </pre>
        </div>
        <div>
          <h3 className="text-title-sm text-[var(--foreground)]">Search components</h3>
          <pre className="code-panel mt-3 px-4 py-4 text-body-sm leading-6">
            <code>npx gamin-ui search hero</code>
          </pre>
        </div>
        <div>
          <h3 className="text-title-sm text-[var(--foreground)]">Upgrade a component</h3>
          <pre className="code-panel mt-3 px-4 py-4 text-body-sm leading-6">
            <code>npx gamin-ui upgrade button</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function MCPPage() {
  return (
    <div style={{ maxWidth: '48rem' }}>
      <p className="text-caption uppercase tracking-[0.28em] text-ui-muted">Get Started</p>
      <h1 className="text-display-md mt-2 text-[var(--foreground)] sm:text-display-lg">MCP</h1>
      <p className="text-body-md mt-4 text-ui-muted leading-7">
        Model Context Protocol (MCP) integration allows AI assistants to interact with the Gamin UI registry directly,
        enabling component discovery and installation through natural language.
      </p>
      <div className="coming-soon-card mt-6">
        <span className="coming-soon-icon"><Bot size={48} style={{ opacity: 0.5, color: 'var(--foreground-muted)' }} /></span>
        <span className="coming-soon-title">MCP Integration</span>
        <span className="coming-soon-description">
          MCP server integration documentation is coming soon. This will enable AI-powered component workflows.
        </span>
      </div>
    </div>
  )
}

/* ── Coming Soon page ── */
function ComingSoonPage({ name }: { name: string }) {
  return (
    <div style={{ maxWidth: '48rem' }}>
      <p className="text-caption uppercase tracking-[0.28em] text-ui-muted">Preview</p>
      <h1 className="text-display-md mt-2 text-[var(--foreground)] sm:text-display-lg">{name}</h1>
      <div className="coming-soon-card mt-6">
        <span className="coming-soon-icon"><Construction size={48} style={{ opacity: 0.5, color: 'var(--foreground-muted)' }} /></span>
        <span className="coming-soon-title">Coming Soon</span>
        <span className="coming-soon-description">
          The {name} component is currently in development. Check back soon for a live preview, usage examples, and installation instructions.
        </span>
      </div>
    </div>
  )
}

/* ── Component detail view ── */
function ComponentDetailPage({ entry, slug }: { entry: RegistryEntry; slug: string }) {
  const { language, styling } = usePreview()
  const { Component, meta, examples } = entry
  const codeExample = examples[language][styling]

  return (
    <div className="app-shell" style={{ maxWidth: '64rem' }}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div>
          <section className="surface-panel rounded-panel p-5 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-caption uppercase tracking-[0.28em] text-ui-muted">{slug}</p>
                <h1 className="text-display-md mt-2 text-[var(--foreground)] sm:text-display-lg">{meta.name}</h1>
                <p className="text-body-sm mt-2 max-w-2xl text-ui-muted sm:text-body-md">
                  {meta.description || 'No description provided.'}
                </p>
              </div>
              <div className="rounded-pill border border-[var(--border-subtle)] bg-[var(--background-muted)] px-4 py-2 text-body-sm font-medium text-ui-muted">
                {meta.version}
              </div>
            </div>

            {/* Live preview */}
            <div className="mt-5 rounded-[1.75rem] border border-dashed border-[var(--border-strong)] bg-[var(--background-muted)] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-caption uppercase tracking-[0.24em] text-ui-muted">Live preview</h4>
                <span className="text-caption text-ui-muted">Interactive component canvas</span>
              </div>
              <div className="surface-card rounded-card p-6">
                <Component />
              </div>
            </div>

            {/* Code example */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <h4 className="text-caption uppercase tracking-[0.24em] text-ui-muted">Usage</h4>
                <div className="flex gap-2">
                  <span className="badge-pill text-caption" style={{ fontSize: '0.6875rem' }}>
                    {language === 'typescript' ? 'TypeScript' : 'JavaScript'}
                  </span>
                  <span className="badge-pill text-caption" style={{ fontSize: '0.6875rem' }}>
                    {styling === 'tailwind' ? 'Tailwind CSS' : 'CSS'}
                  </span>
                </div>
              </div>
              <pre className="code-panel mt-3 px-4 py-4 text-body-sm leading-6">
                <code>{codeExample}</code>
              </pre>
            </div>
          </section>
        </div>

        {/* Metadata sidebar */}
        <aside className="surface-panel rounded-panel p-5 sm:p-6">
          <h4 className="text-caption uppercase tracking-[0.24em] text-ui-muted">Installation</h4>
          <pre className="code-panel mt-3 px-4 py-3 text-body-sm">
            <code>npx gamin-ui add {slug}</code>
          </pre>
          <p className="text-body-sm mt-3 text-ui-muted">To auto-install deps:</p>
          <pre className="code-panel mt-3 px-4 py-3 text-body-sm">
            <code>npx gamin-ui add {slug} --install</code>
          </pre>

          <h4 className="text-caption mt-6 uppercase tracking-[0.24em] text-ui-muted">Metadata</h4>
          <pre className="surface-card rounded-card mt-3 overflow-x-auto p-4 text-caption leading-6 text-[var(--foreground)]">
            {JSON.stringify(meta, null, 2)}
          </pre>

          <h4 className="text-caption mt-6 uppercase tracking-[0.24em] text-ui-muted">Source</h4>
          <p className="text-body-sm mt-3 leading-6 text-ui-muted">Fetch raw source via the registry API:</p>
          <pre className="code-panel mt-3 px-4 py-3 text-body-sm">
            <code>GET /api/components/{slug}</code>
          </pre>
        </aside>
      </div>
    </div>
  )
}

/* ── Main page component ── */
export default function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  // Static content pages
  if (slug === 'introduction') return <IntroductionPage />
  if (slug === 'installation') return <InstallationPage />
  if (slug === 'mcp') return <MCPPage />

  // Registry component pages
  const entry = registryMap[slug]
  if (entry) return <ComponentDetailPage entry={entry} slug={slug} />

  // Find the label from sidebar data for coming-soon items
  const allItems = getAllItems()
  const sidebarItem = allItems.find((item) => item.slug === slug)

  // Slug not in sidebar data at all — trigger 404
  if (!sidebarItem) notFound()

  return <ComingSoonPage name={sidebarItem.label} />
}
