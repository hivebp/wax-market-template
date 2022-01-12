import React from 'react'
import cn from 'classnames'
import Button from './Button'

export default function Icon({ children, className, onClick, disabled }) {
    return (
        <Button
            className={cn('relative h-6.5', 'text-lg text-white text-center no-underline', className)}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}
