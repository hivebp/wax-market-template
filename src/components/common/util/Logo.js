import React from 'react'
import Link from './input/Link'
import config from '../../../config.json'
import cn from 'classnames'

export default function Logo() {
  return (
    <Link href={'/'} className="opacity-100 p-2">
        <img
            className={cn('h-20 w-auto z-10')}
            src="/logo.png"
            alt={config.market_title}
        />
    </Link>
  )
}