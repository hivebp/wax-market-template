import React from 'react'
import cn from 'classnames'
import Button from "../common/util/input/Button";

export default function PopupButton(
    {text, className, disabled, onClick}
) {
    return (
        <Button
            className={cn(
                'w-36 h-8 ml-4 bg-primary',
                'text-xxs text-secondary',
                'border border-solid border-primary',
                'rounded-bl-xl rounded-tr-xl outline-none',
                'hover:font-bold',
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}