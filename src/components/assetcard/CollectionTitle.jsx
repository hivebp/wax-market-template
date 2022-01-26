import cn from 'classnames'
import React, { useMemo } from 'react'
import config from '../../config.json'
import Link from '../common/util/input/Link'

/** @type {React.FC<{ collection: import('../../api/fetch').CollectionData, hasLink?: boolean }>} */
const CollectionTitle = ({ collection, hasLink = false }) => {
    const content = useMemo(
        () => (
            <div
                className={cn(
                    'relative flex items-center leading-4 p-2',
                    'text-white leading-relaxed text-sm',
                    'cursor-pointer',
                )}
            >
                {collection['img'] ? (
                    <div className="h-4 rounded-lg overflow-hidden">
                        <img src={config.ipfs + collection['img']} className="collection-img" alt="none" />
                    </div>
                ) : (
                    ''
                )}
                <div className="font-light ml-2 mr-auto opacity-60 truncate">{collection['collection_name']}</div>
            </div>
        ),
        [collection],
    )
    return hasLink ? <Link href={'/collection/' + collection['collection_name']}>{content}</Link> : content
}

export default CollectionTitle
