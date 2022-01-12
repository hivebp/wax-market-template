import React, { useEffect, useState } from 'react'

import config from '../../config.json'

import cn from 'classnames'
import CardImage from '../assetcard/CardImage'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'

function ResultCard(props) {
    const index = props['index']

    const template = props['template']

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => setLoading(false), index * 1000)
    }, [])

    const { collection, name } = template

    const { collection_name } = collection

    return loading ? (
        <LoadingIndicator />
    ) : (
        <div
            className={cn(
                'relative w-full mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper',
            )}
            id={'ResultCard_' + index}
        >
            <div className={cn('flex justify-between my-2 px-2')}>
                <div className={cn('relative flex items-center leading-4', 'text-white leading-relaxed text-sm')}>
                    {collection['img'] ? (
                        <div className="h-4 rounded-lg overflow-hidden">
                            <img src={config.ipfs + collection['img']} className="collection-img" alt="none" />
                        </div>
                    ) : (
                        ''
                    )}
                    <div className="font-light ml-2 mr-auto opacity-60 truncate">{collection_name}</div>
                </div>
            </div>
            <div className="flex flex-1 h-full">
                <CardImage {...props} asset={template} />
            </div>

            <div className="relative">
                <p
                    className={cn(
                        'w-full pt-4 px-2 mb-5',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible',
                    )}
                >
                    {name}
                </p>
            </div>
        </div>
    )
}

export default ResultCard
