import cn from 'classnames'
import React from 'react'

/**
 * @type {React.FC<{ className?: string }>}
 */
export const Content = ({ className, children }) => (
    <div className={cn('md:flex md:flex-row relative', 'pt-6 px-6 pb-6', className)}>{children}</div>
)

export default Content
