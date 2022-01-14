import cn from 'classnames'
import React from 'react'
import config from '../../../config.json'
import Link from './input/Link'

export default function Logo() {
    return (
        <Link href={'/'} className="opacity-100 p-2">
            <img className={cn('h-20 w-auto z-10')} src="/wax.png" alt={config.market_title} />
        </Link>
    )
}
