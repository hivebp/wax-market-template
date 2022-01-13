import cn from 'classnames'
import React from 'react'
import Button from '../common/util/input/Button'

export default function WindowButton({ text, className, disabled, onClick, id }) {
    return (
        <Button
            className={cn(
                'w-36 h-8 ml-4',
                'text-xxs text-secondary',
                'border border-solid',
                'rounded-bl-xl rounded-tr-xl outline-none',
                'hover:font-bold',
                className,
                { 'bg-gray-400 border-gray-400 cursor-not-allowed': disabled },
                { 'border-primary bg-primary': !disabled },
            )}
            id={id}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </Button>
    )
}
