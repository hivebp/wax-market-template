import cn from 'classnames'
import React from 'react'

function ErrorMessage(props) {
    const error = props['error']
    const layer = true

    return (
        <div
            className={cn(
                'fixed top-1/3 m-auto py-3 px-4',
                'flex flex-row left-error overflow-y-auto',
                'bg-red-500 bg-opacity-90 w-2/3',
                'border-2 border-solid rounded-2xl border-red-900',
                { 'z-30': layer },
            )}
        >
            <div className="m-auto">
                <img className="w-20 min-h-20 h-auto" src="/Warning_icn.svg" alt="!" />
            </div>
            <div className="pl-4 m-auto h-full overflow-y-auto">{error}</div>
        </div>
    )
}

export default ErrorMessage
