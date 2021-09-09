import React from 'react'
import cn from 'classnames'

export default function ScrollUpIcon(
  { className, onClick}
) {
  return (
    <button 
        className={cn(
            "absolute right-14 bottom-10",
            "lg:right-16 lg:bottom-16",
            className
        )}
        onClick={onClick}
    >
      <img className="w-10 h-10" src="/up-arrow.svg" alt="up" />
    </button>
  )
}