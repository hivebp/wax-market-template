import cn from 'classnames'
import React from 'react'

/** @type {React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>} */
export const Button = ({ children, className, disabled, onClick, id }) => {
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
                className,
            )}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
