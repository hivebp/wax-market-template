import React from 'react'
import cn from 'classnames'

export default function Content({className, children}) {

  return (
    <div
      className={cn(
        'md:flex md:flex-row relative',
        'pt-6 px-6 pb-6',
        className
      )}
    >
        {children}
    </div>
  )
}