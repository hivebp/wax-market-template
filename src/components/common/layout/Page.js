import React from 'react'
import cn from 'classnames'

export default function Page({className, children, onScroll, id}) {

  return (
    <div
      className={cn(
          'w-full h-auto min-h-full overflow-x-hidden',
          'm-auto ml-0 z-10',
          'transition transform duration-200',
        className
      )}
      onScroll={onScroll}
      id={id}
    >
        {children}
    </div>
  )
}