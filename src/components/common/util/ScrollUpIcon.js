import React from 'react'
import Button from './input/Button'
import cn from 'classnames'

export default function ScrollUpIcon({ className, onClick }) {
    return (
        <Button className={cn('absolute right-14 bottom-10', 'lg:right-16 lg:bottom-16', className)} onClick={onClick}>
            <img className="w-6 h-6" src="/up-arrow.svg" alt="up" />
        </Button>
    )
}
