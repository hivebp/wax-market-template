import React from 'react'
import Link from './input/Link'
import config from '../../../config.json'
import cn from 'classnames'

export default function Logo() {
  return (
    <Link href={'/'} className="opacity-100 p-2">
        <img
            className={cn('h-24 w-48 z-10')}
            src="/YoshiDrops_Symbol_2-Color_GreenCircle_v001a.png"
            alt={config.market_title}
        />
    </Link>
  )
}