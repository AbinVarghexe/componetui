import React from 'react'

export default function HeroModern({ title = 'Welcome', subtitle = 'Build better UIs' }) {
  return (
    <section
      className="surface-card rounded-panel px-6 py-16 text-center"
    >
      <p className="text-caption m-0 uppercase tracking-[0.18em] text-ui-muted">
        Featured hero
      </p>
      <h1 className="text-display-lg mx-auto mt-4 max-w-4xl text-[var(--foreground)]">{title}</h1>
      <p className="text-body-md mx-auto mt-3 max-w-[35rem] text-ui-muted">{subtitle}</p>
      <div className="mt-6">
        <button className="button-primary button-pill text-button">Get Started</button>
      </div>
    </section>
  )
}
