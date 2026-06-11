import React, { type MouseEventHandler, type ReactNode } from 'react'

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
}
