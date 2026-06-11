import React from 'react'

export default function PricingCard({ title = 'Pro', price = '$9' }) {
  return (
    <div className="surface-card rounded-card card-padding-lg" style={{ width: 280 }}>
      <p className="text-caption m-0 uppercase tracking-[0.16em] text-ui-muted">Plan</p>
      <h3 className="text-title-lg mt-2 text-[var(--foreground)]">{title}</h3>
      <p className="text-display-sm mt-3 text-[var(--foreground)]">
        {price}
        <span className="text-body-md text-ui-muted">/mo</span>
      </p>
      <p className="text-body-md text-ui-muted mt-0 leading-6">A polished price point with gentle hierarchy and Apple-like clarity.</p>
      <button className="button-primary button-pill text-button mt-4 w-full">Buy</button>
    </div>
  )
}
