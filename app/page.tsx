"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "../registry/button/button";
import HeroModern from "../registry/hero-modern/hero-modern";
import PricingCard from "../registry/pricing-card/pricing-card";


// Component data for the interactive explorer
const EXPLORER_COMPONENTS = [
  {
    id: "button",
    name: "button.tsx",
    code: `import React, { type MouseEventHandler, type ReactNode } from 'react'

type ButtonProps = {
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function Button(props: ButtonProps) {
  const { children, onClick } = props

  return (
    <button
      onClick={onClick}
      className="button-secondary button-pill text-button"
    >
      {children || 'Button'}
    </button>
  )
}`
  },
  {
    id: "hero-modern",
    name: "hero-modern.tsx",
    code: `import React from 'react'

export default function HeroModern({ title = 'Welcome', subtitle = 'Build better UIs' }) {
  return (
    <section className="surface-card rounded-panel px-6 py-16 text-center">
      <p className="text-caption m-0 uppercase tracking-[0.18em] text-ui-muted">
        Featured hero
      </p>
      <h1 className="text-display-lg mx-auto mt-4 max-w-4xl text-[var(--foreground)]">
        {title}
      </h1>
      <p className="text-body-md mx-auto mt-3 max-w-[35rem] text-ui-muted">
        {subtitle}
      </p>
      <div className="mt-6">
        <button className="button-primary button-pill text-button">Get Started</button>
      </div>
    </section>
  )
}`
  },
  {
    id: "pricing-card",
    name: "pricing-card.tsx",
    code: `import React from 'react'

export default function PricingCard({ title = 'Pro', price = '$9' }) {
  return (
    <div className="surface-card rounded-card card-padding-lg w-[280px]">
      <p className="text-caption m-0 uppercase tracking-[0.16em] text-ui-muted">Plan</p>
      <h3 className="text-title-lg mt-2 text-[var(--foreground)]">{title}</h3>
      <p className="text-display-sm mt-3 text-[var(--foreground)]">
        {price}
        <span className="text-body-md text-ui-muted">/mo</span>
      </p>
      <button className="button-primary button-pill text-button mt-4 w-full">Buy</button>
    </div>
  )
}`
  },
  {
    id: "accordion",
    name: "accordion.tsx",
    code: `import React, { useState } from 'react'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="border-b border-[var(--border-subtle)]">
          <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
            {item.title}
          </button>
          {openIndex === idx && <div>{item.content}</div>}
        </div>
      ))}
    </div>
  )
}`
  },
  {
    id: "input",
    name: "input.tsx",
    code: `import React from 'react'

export default function Input({ placeholder, ...props }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="text-input rounded-md border border-[var(--border-subtle)] w-full px-4 py-2"
      {...props}
    />
  )
}`
  }
];

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [explorerIndex, setExplorerIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [activePreview, setActivePreview] = useState<"button" | "pricing-card" | "hero-modern">("button");
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState<string>("40.8k");

  useEffect(() => {
    fetch("https://api.github.com/repos/AbinVarghexe/componetui")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stargazers");
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          const count = data.stargazers_count;
          if (count >= 1000) {
            setStars(`${(count / 1000).toFixed(1)}k`);
          } else {
            setStars(count.toString());
          }
        }
      })
      .catch((err) => {
        console.warn("GitHub API error, using default stars value:", err);
      });
  }, []);

  // States for interactive toolbar
  const [liked, setLiked] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trashConfirmed, setTrashConfirmed] = useState(false);

  // Sync state with HTML root className
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  // Read initial class from DOM to sync state
  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx gamin-ui add button");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFile = EXPLORER_COMPONENTS[explorerIndex];

  return (
    <main className="page-shell bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* NAVBAR */}
      <header className="app-shell flex items-center justify-between py-4 border-b border-[var(--border-subtle)] bg-[var(--background-elevated)] backdrop-blur rounded-pill px-6 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-title-md font-bold tracking-tight text-[var(--foreground)]">
            Gamin UI<span className="text-[var(--accent)]">.</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/preview" className="text-nav-link text-ui-muted hover:text-[var(--foreground)] transition-colors">
            Components
          </Link>
          <span className="text-nav-link text-ui-muted cursor-not-allowed opacity-50">
            Docs
          </span>
          <span className="text-nav-link text-ui-muted cursor-not-allowed opacity-50">
            Blog
          </span>
        </nav>
        <div className="flex items-center gap-4">
          {/* GitHub Rating Button with Blue Accent Color */}
          <a 
            href="https://github.com/AbinVarghexe/componetui" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-button"
          >
            <svg className="w-4 h-4 fill-current text-[var(--accent)]" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span className="text-caption text-[var(--accent)]">★ {stars}</span>
          </a>

          {/* Theme Switcher Toggle Pill */}
          <div className="toggle-pill-group">
            <button
              onClick={() => setTheme("light")}
              className={`toggle-pill-option ${theme === "light" ? "toggle-pill-option-active" : ""}`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`toggle-pill-option ${theme === "dark" ? "toggle-pill-option-active" : ""}`}
            >
              Dark
            </button>
          </div>
          <Link href="/preview" className="button-primary button-pill text-button">
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION WITH CSS GRID BACKGROUND */}
      <section className="app-shell relative bg-grid border border-[var(--border-subtle)] rounded-panel overflow-hidden mt-8 p-8 sm:p-12 lg:p-16">
        {/* Subtle blue ambient radial gradient glow */}
        <div className="absolute inset-0 bg-radial-gradient from-[rgba(59,130,246,0.06)] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 hero-container">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-pill border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-1.5 text-caption text-ui-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              Version 1.1.0 is out!
            </div>
            <h1 className="text-display-xl leading-tight">
              React components for creative developers
            </h1>
            <p className="text-body-md text-ui-muted max-w-xl">
              Highly customizable React components ready to copy and paste into your Tailwind CSS projects. Made to be customized, matching an Apple-inspired visual polish and precise spatial harmony.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/preview" className="button-primary button-pill text-button">
                Explore Components
              </Link>
              <a href="#installer" className="button-secondary button-pill text-button">
                Installation
              </a>
            </div>
          </div>

          {/* CODE EXPLORER MOCKUP */}
          <div className="surface-card rounded-mockup overflow-hidden flex flex-col min-h-[420px] border border-[var(--border-subtle)] relative z-20">
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-subtle)] bg-[var(--background-elevated)]">
              <p className="text-caption uppercase tracking-[0.15em] text-ui-muted">
                Component Explorer
              </p>
              <div className="w-40 bg-[var(--color-surface-card)] border border-[var(--border-subtle)] rounded-pill px-3 py-1 text-caption text-ui-muted flex items-center justify-between">
                <span>Search...</span>
                <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-[160px_1fr] flex-grow">
              {/* Sidebar directory */}
              <div className="border-r border-[var(--border-subtle)] bg-[var(--background-elevated)] p-2 space-y-1">
                <p className="text-caption px-2 py-1 text-ui-muted uppercase tracking-[0.12em]">
                  components/
                </p>
                {EXPLORER_COMPONENTS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setExplorerIndex(idx)}
                    className={`registry-list-item ${
                      explorerIndex === idx
                        ? "registry-list-item-active text-[var(--accent)] border-l-2 border-[var(--accent)]"
                        : "registry-list-item-inactive"
                    }`}
                  >
                    📄 {item.name}
                  </button>
                ))}
              </div>

              {/* Code view */}
              <div className="flex flex-col bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] p-4 overflow-auto max-h-[350px]">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                  <span className="text-caption font-mono text-[var(--color-on-dark-soft)]">
                    {currentFile.name}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentFile.code);
                    }}
                    className="button-secondary button-pill text-button"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="text-[12px] font-mono leading-relaxed text-[var(--color-on-dark-soft)] overflow-x-auto">
                  <code>{currentFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID WITH LOTTIE FILE INFOGRAPHICS */}
      <section className="app-shell section-padding">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-display-lg">
            What's inside
          </h2>
          <p className="text-body-md text-ui-muted max-w-lg mx-auto">
            A refined foundation built on clean CSS variables, elegant custom tokens, and modular components.
          </p>
        </div>

        <div className="feature-grid">
          {/* Card 1: 15+ Components + Lottie Loader/Infographic */}
          <div className="surface-card rounded-card card-padding-lg flex flex-col justify-between min-h-[380px]">
            <div>
              <h3 className="text-title-md">
                15+ Components
              </h3>
              <p className="text-body-sm text-ui-muted mt-2">
                Ready to use in your Next.js and React projects. Simple copying, pasting, and full ownership.
              </p>
            </div>
            {/* Lottie Animation Infographic 1 */}
            <div className="my-4 h-36 flex items-center justify-center bg-[var(--background-muted)] rounded-card border border-[var(--border-subtle)]">
              <lottie-player src="https://lottie.host/e59d9c22-b5e1-40ef-82ec-c34d400e95cb/sHk5w5H7xI.json" background="transparent" speed="1" loop autoplay style={{ width: "100%", height: "100%", minHeight: "140px" }} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Accordion", "Alert", "Button", "Card", "Dialog", "Input"].map((badge) => (
                <span key={badge} className="badge-pill text-caption">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Workflows + Lottie Loader/Infographic */}
          <div className="surface-card rounded-card card-padding-lg flex flex-col justify-between min-h-[380px]">
            <div>
              <h3 className="text-title-md">
                Workflows
              </h3>
              <p className="text-body-sm text-ui-muted mt-2">
                Pre-configured page layouts, interactive billing structures, and modern dashboards to speed up product launches.
              </p>
            </div>
            {/* Lottie Animation Infographic 2 */}
            <div className="my-4 h-36 flex items-center justify-center bg-[var(--background-muted)] rounded-card border border-[var(--border-subtle)]">
              <lottie-player src="https://lottie.host/ea9a7f3f-4e00-47b2-a4f6-8c440d4f2fa6/Nl2b8G6a1n.json" background="transparent" speed="1" loop autoplay style={{ width: "100%", height: "100%", minHeight: "140px" }} />
            </div>
            <div className="text-[var(--accent)] text-caption uppercase tracking-[0.1em]">
              Ready to ship →
            </div>
          </div>

          {/* Card 3: Fully Typed + Lottie Loader/Infographic */}
          <div className="surface-card rounded-card card-padding-lg flex flex-col justify-between min-h-[380px]">
            <div>
              <h3 className="text-title-md">
                Fully Typed
              </h3>
              <p className="text-body-sm text-ui-muted mt-2">
                Constructed using TypeScript, React 19, and Tailwind CSS. Provides auto-completions, type checkers, and clean APIs.
              </p>
            </div>
            {/* Lottie Animation Infographic 3 */}
            <div className="my-4 h-36 flex items-center justify-center bg-[var(--background-muted)] rounded-card border border-[var(--border-subtle)]">
              <lottie-player src="https://lottie.host/c5c8a2b5-55a8-4443-bfb7-202d6df3ebcb/c7mNlA2l0z.json" background="transparent" speed="1" loop autoplay style={{ width: "100%", height: "100%", minHeight: "140px" }} />
            </div>
            <div className="text-ui-muted text-caption font-mono">
              {"interface Props {}"}
            </div>
          </div>

          {/* Card 4 */}
          <div className="surface-card rounded-card card-padding-lg h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-title-md">
                For Everyone
              </h3>
              <p className="text-body-sm text-ui-muted mt-2">
                Highly accessible interfaces designed with keyboard navigation, aria tags, and responsive design systems.
              </p>
            </div>
            <div className="text-ui-muted text-caption">
              Responsive breakpoints configured.
            </div>
          </div>

          {/* Card 5 */}
          <div className="surface-card rounded-card card-padding-lg h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-title-md">
                CLI Tool
              </h3>
              <p className="text-body-sm text-ui-muted mt-2">
                Install and update components instantly. Run npx commands directly inside your development workspaces.
              </p>
            </div>
            <div className="text-[var(--accent)] text-caption font-mono">
              $ npx gamin-ui add
            </div>
          </div>

          {/* Card 6 */}
          <div className="surface-card rounded-card card-padding-lg h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-title-md">
                GitHub Stars
              </h3>
              <p className="text-body-sm text-ui-muted mt-2">
                Accelerating growth driven by standard-conforming builders and design lovers worldwide.
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-display-sm font-semibold">{stars.toUpperCase()}</span>
                <span className="text-caption text-[var(--accent)] font-medium">Star History</span>
              </div>
              <svg viewBox="0 0 100 30" className="w-full h-10 text-[var(--accent)] stroke-current fill-none">
                <path d="M0,25 Q20,23 40,19 T80,11 T100,2" strokeWidth="2" strokeLinecap="round" />
                <path d="M0,25 Q20,23 40,19 T80,11 T100,2 L100,30 L0,30 Z" className="fill-[var(--background-muted)] opacity-20" stroke="none" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="app-shell section-padding border-t border-[var(--border-subtle)]">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-display-lg">
            Loved by developers
          </h2>
          <p className="text-body-md text-ui-muted max-w-lg mx-auto">
            See how frontend engineers are utilizing Gamin UI to ship beautiful components instantly.
          </p>
        </div>

        <div className="testimonial-grid">
          {[
            {
              initials: "AV",
              name: "Alex V.",
              handle: "@alexv_dev",
              text: "The button styling and spacing system is pure art. Very clean variables structure, copy-pasting is a dream!"
            },
            {
              initials: "MR",
              name: "Maria R.",
              handle: "@mariacodes",
              text: "The component installation is super fast. Zero dependencies conflicts. Type-safe APIs make development smooth."
            },
            {
              initials: "TH",
              name: "Thomas H.",
              handle: "@tommy_h",
              text: "Gamin UI components feel polished right out of the box. Highly responsive, adapting perfectly to dark/light."
            },
            {
              initials: "KL",
              name: "Kate L.",
              handle: "@katestyles",
              text: "The Apple-like visual language is just gorgeous. Subtle borders, clean text weights, and great whitespace balance!"
            }
          ].map((t, idx) => (
            <div key={idx} className="surface-card rounded-card card-padding-lg flex flex-col justify-between space-y-4">
              <p className="text-body-sm text-ui-muted italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--border-subtle)]">
                <div className="avatar-circle flex items-center justify-center bg-[var(--color-surface-card)] text-caption text-[var(--foreground)] border border-[var(--border-subtle)]">
                  {t.initials}
                </div>
                <div>
                  <p className="text-caption leading-none">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-ui-muted mt-0.5 leading-none">
                    {t.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEE THEM IN ACTION SECTION */}
      <section className="app-shell section-padding border-t border-[var(--border-subtle)]">
        <div className="space-y-4 text-center mb-12">
          <h2 className="text-display-lg">
            See them in action
          </h2>
          <p className="text-body-md text-ui-muted max-w-lg mx-auto">
            Test real interactive registry components and animation visualizers directly below.
          </p>
        </div>

        <div className="feature-grid">
          {/* Action 1: Live Registry Showcase */}
          <div className="surface-card rounded-card card-padding-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h3 className="text-title-sm">Live Preview</h3>
                <div className="toggle-pill-group">
                  {(["button", "pricing-card", "hero-modern"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActivePreview(mode)}
                      className={`toggle-pill-option ${
                        activePreview === mode ? "toggle-pill-option-active" : ""
                      }`}
                    >
                      {mode === "button" ? "Button" : mode === "pricing-card" ? "Pricing" : "Hero"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center min-h-[160px] bg-[var(--background-muted)] rounded-card border border-dashed border-[var(--border-strong)] p-4">
                {activePreview === "button" && (
                  <Button onClick={() => setClickCount((c) => c + 1)}>
                    Clicked {clickCount} times
                  </Button>
                )}
                {activePreview === "pricing-card" && (
                  <div className="scale-90">
                    <PricingCard title="Growth" price="$29" />
                  </div>
                )}
                {activePreview === "hero-modern" && (
                  <div className="scale-75 w-full">
                    <HeroModern title="Calm UIs" subtitle="Apple-inspired components." />
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-ui-muted mt-4">
              Showing active component: <strong className="text-[var(--accent)]">{activePreview}</strong>
            </p>
          </div>

          {/* Action 2: Shiny Text */}
          <div className="surface-card rounded-card card-padding-lg flex flex-col justify-between">
            <div>
              <h3 className="text-title-sm border-b border-[var(--border-subtle)] pb-3">
                Micro-Animations
              </h3>
              <div className="mt-8 flex flex-col items-center justify-center p-6 bg-[var(--background-elevated)] border border-[var(--border-subtle)] rounded-card min-h-[160px]">
                <h3 className="text-display-sm animate-shine select-none">
                  Shiny Text Effect
                </h3>
                <p className="text-body-sm text-ui-muted mt-2">
                  Hover to see gradient shift
                </p>
              </div>
            </div>
            <p className="text-[11px] text-ui-muted mt-4">
              Built using inline CSS keyframe gradient shift rules.
            </p>
          </div>

          {/* Action 3: Interactive Toolbar */}
          <div className="surface-card rounded-card card-padding-lg flex flex-col justify-between">
            <div>
              <h3 className="text-title-sm border-b border-[var(--border-subtle)] pb-3">
                Interactive Toolbar
              </h3>
              <div className="mt-8 flex flex-col items-center justify-center min-h-[160px] bg-[var(--background-muted)] rounded-card border border-[var(--border-subtle)] p-6">
                <div className="flex items-center gap-3 bg-[var(--background)] p-3 rounded-pill border border-[var(--border-strong)] shadow-card">
                  {/* Search Icon */}
                  <button className="button-icon-circular">
                    <svg className="w-4 h-4 text-ui-muted hover:text-[var(--foreground)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  {/* Lock Toggle */}
                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    className="button-icon-circular"
                  >
                    {isLocked ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>

                  {/* Play Toggle */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="button-icon-circular"
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    )}
                  </button>

                  {/* Heart Toggle */}
                  <button
                    onClick={() => setLiked(!liked)}
                    className="button-icon-circular"
                  >
                    <svg className={`w-4 h-4 ${liked ? "text-[var(--accent)]" : ""}`} fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Trash Action */}
                  <button
                    onClick={() => {
                      setTrashConfirmed(true);
                      setTimeout(() => setTrashConfirmed(false), 2000);
                    }}
                    className="button-icon-circular"
                  >
                    <svg className={`w-4 h-4 ${trashConfirmed ? "text-[var(--accent)]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {trashConfirmed && (
                  <span className="text-[10px] text-[var(--accent)] mt-3">
                    Action executed successfully
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-ui-muted mt-4">
              Interactive toolbar triggers client state modifications.
            </p>
          </div>
        </div>
      </section>

      {/* GET STARTED: INSTALLER CARD */}
      <section id="installer" className="app-shell max-w-xl mx-auto py-16">
        <div className="surface-panel rounded-mockup card-padding-lg flex flex-col space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-title-lg">Get started in seconds</h3>
            <p className="text-body-sm text-ui-muted">
              Run the installer command using npx to inject components directly.
            </p>
          </div>

          <div className="flex items-center justify-between bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] rounded-card px-4 py-3.5 border border-[var(--border-subtle)] mt-2">
            <code className="text-body-sm font-mono text-[var(--color-on-dark-soft)]">
              npx gamin-ui add button
            </code>
            <button
              onClick={handleCopy}
              className="button-secondary button-pill text-button"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-ui-muted text-center leading-relaxed">
            Installs required dependencies automatically using your detected package manager (npm, pnpm, yarn, bun).
          </p>
        </div>
      </section>

      {/* SUPPORTED ECOSYSTEMS */}
      <section className="app-shell py-12 border-t border-[var(--border-subtle)]">
        <p className="text-caption uppercase tracking-[0.24em] text-ui-muted text-center mb-6">
          Supported ecosystems
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-ui-muted font-semibold text-body-md">
          <span className="hover:text-[var(--accent)] transition-colors">React 19</span>
          <span className="hover:text-[var(--accent)] transition-colors">Next.js 16</span>
          <span className="hover:text-[var(--accent)] transition-colors text-[var(--accent)]">Tailwind CSS v4</span>
          <span className="hover:text-[var(--accent)] transition-colors">TypeScript</span>
          <span className="hover:text-[var(--accent)] transition-colors">Framer Motion</span>
          <span className="hover:text-[var(--accent)] transition-colors">Vercel</span>
        </div>
      </section>

      {/* PRE-FOOTER CTA BAND */}
      <section className="app-shell py-12">
        <div className="surface-panel rounded-card card-padding-xl text-center space-y-6">
          <h2 className="text-display-md">
            Stop building from scratch
          </h2>
          <p className="text-body-md text-ui-muted max-w-md mx-auto leading-relaxed">
            Start copying, pasting, and customizing beautifully polished components today. Maintain full control of your codebase.
          </p>
          <div>
            <Link href="/preview" className="button-primary button-pill text-button">
              Explore Components
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-main">
        <div className="app-shell grid gap-8 sm:grid-cols-2 lg:grid-cols-5 px-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-title-sm font-bold text-[var(--color-on-dark)]">
              Gamin UI<span className="text-[var(--accent)]">.</span>
            </h3>
            <p className="text-body-sm text-[var(--color-on-dark-soft)] max-w-sm leading-relaxed">
              A refined component registry with an Apple-inspired presentation. Delivers code ownership straight to developers.
            </p>
            <p className="text-caption text-ui-muted">
              © {new Date().getFullYear()} Gamin UI. All rights reserved.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-caption font-semibold uppercase tracking-wider text-[var(--color-on-dark)]">
              Product
            </h4>
            <ul className="space-y-2 text-caption">
              <li>
                <Link href="/preview" className="hover:text-white transition-colors">
                  Registry
                </Link>
              </li>
              <li className="opacity-50">Components</li>
              <li className="opacity-50">Workflows</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-caption font-semibold uppercase tracking-wider text-[var(--color-on-dark)]">
              Resources
            </h4>
            <ul className="space-y-2 text-caption">
              <li className="opacity-50">Documentation</li>
              <li className="opacity-50">CLI Commands</li>
              <li>
                <a 
                  href="https://github.com/AbinVarghexe/componetui" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-caption font-semibold uppercase tracking-wider text-[var(--color-on-dark)]">
              Company
            </h4>
            <ul className="space-y-2 text-caption">
              <li className="opacity-50">About</li>
              <li className="opacity-50">Blog</li>
              <li className="opacity-50">Careers</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
