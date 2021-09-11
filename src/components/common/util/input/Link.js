import React from 'react'
import cn from 'classnames'
import NextLink from 'next/link'

export default function Link(
  { children, className, href, external }
) {
  const linkClassNames = cn(
    'block',
    'focus-visible:ring-1 focus-visible:ring-inset',
    'focus-visible:ring-primary',
    'cursor-pointer',
    className
  )
  if (external)
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={linkClassNames}
      >
        {children}
      </a>
    )
  return (
    <NextLink href={href} passHref>
      <a className={linkClassNames}>
        {children}
      </a>
    </NextLink>
  )
}