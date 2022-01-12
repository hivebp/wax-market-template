import cn from 'classnames'
import React from 'react'
import config from '../../config.json'
import Link from '../common/util/input/Link'
import LazyLoad from '../helpers/LazyLoad'

function CollectionCard(props) {
    const collectionItem = props['collection']

    const { name, img, collection_name } = collectionItem

    return (
        <LazyLoad>
            <div className={cn('w-full p-4 rounded-md', 'border border-paper', 'transition-opacity hover:opacity-80')}>
                <div className={'h-60 cursor-pointer'}>
                    <Link href={`/collection/${collection_name}`}>
                        <div className="flex justify-center w-48 h-48 m-auto">
                            <div>
                                <img className="m-auto" src={config.ipfs + img} alt="none" />
                            </div>
                        </div>
                    </Link>
                    <Link href={`/collection/${collection_name}`}>
                        <h4 className={cn('text-white cursor-pointer text-center mt-2 font-bold text-2xl')}>
                            <div>{name}</div>
                        </h4>
                    </Link>
                </div>
            </div>
        </LazyLoad>
    )
}

export default CollectionCard
