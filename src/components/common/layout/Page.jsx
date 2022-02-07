import cn from 'classnames'
import React from 'react'

/**
 * @type {React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>}
 */
export const Page = ({ className, ...props }) => (
    <div
        className={cn(
            'w-full h-auto min-h-full overflow-x-hidden',
            'm-auto ml-0 z-10',
            'transition transform duration-200',
            className,
        )}
        {...props}
    />
)

export default Page
