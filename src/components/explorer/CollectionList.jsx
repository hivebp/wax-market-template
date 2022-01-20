import cn from 'classnames'
import React from 'react'
import { useCollectionData } from '../../api/api_hooks'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import CollectionCard from './CollectionCard'

/**
 * @type {React.FC}
 */
const CollectionList = () => {
    const { data: collectionData, loading } = useCollectionData()

    return (
        <div className={cn('lg:justify-evenly px-6', 'min-h-60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8')}>
            {loading ? (
                <LoadingIndicator />
            ) : (
                collectionData.map((collection, index) => (
                    <CollectionCard key={`${collection.collection_name}_${index}`} collection={collection} />
                ))
            )}
        </div>
    )
}

export default CollectionList
