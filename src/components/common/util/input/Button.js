import React from 'react'
import cn from 'classnames'

export default function Button(
  { children, className, disabled, onClick, id}
) {
  return (
    <button
      id={id}
      className={cn(
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-inset',
        'focus-visible:ring-primary',
        'transition-opacity duration-200',
        'opacity-75 hover:opacity-100',
        'cursor-pointer',
        { 'cursor-not-allowed': disabled },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}