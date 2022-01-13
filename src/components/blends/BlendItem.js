import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { getCollection } from '../../api/fetch'
import CollectionTitle from '../assetcard/CollectionTitle'
import Link from '../common/util/input/Link'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import BlendPreviewImage from './BlendPreviewImage'

function BlendItem(props) {
    const [state, dispatch] = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    const [collection, setCollection] = useState(null)

    const blend = props['blend']

    const { display_data, blend_id, collection_name, start_time, end_time } = blend

    const displaydata = JSON.parse(display_data)

    const { name, image } = displaydata

    const currentTime = Date.now() / 1000 // check if this is correct; blend.start_time might be in milliseconds

    const parseCollection = (res) => {
        if (res && res['success']) setCollection(res['data'])

        setIsLoading(false)
    }

    useEffect(() => {
        getCollection(collection_name).then(parseCollection)
    }, [collection_name])

    return (
        <div className={cn('w-full')}>
            {isLoading ? (
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
                >
                    <CollectionTitle collection={collection} />
                    <Link href={`/blend/${blend_id}`}>
                        <div className={cn('w-full')}>
                            <BlendPreviewImage {...props} asset={{ data: { img: image } }} />
                        </div>
                        <div
                            className={cn(
                                'w-full flex justify-center items-center p-2 h-16',
                                'text-center text-base font-light text-neutral',
                            )}
                        >
                            {name}
                        </div>
                        <div
                            className={cn(
                                'w-full flex justify-center items-center',
                                'text-center text-base font-light text-neutral',
                            )}
                        >
                            {(currentTime < start_time && currentTime > end_time) || end_time === 0
                                ? 'Active'
                                : 'Inactive'}
                        </div>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default BlendItem
