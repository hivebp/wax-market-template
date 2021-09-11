import React from 'react';
import cn from "classnames";

import LazyLoad from "react-lazy-load";

import Link from '../common/util/input/Link';
import config from "../../config.json";

function CollectionPreview(props) {
    const collectionItem = props['collection'];

    const {name, img, collection_name} = collectionItem;

    return (
        <LazyLoad>
            <div className={cn(
                'w-full p-4 rounded-md',
                'border border-paper',
                'transition-opacity hover:opacity-80',
            )}>
                <Link href={'/collection/' + collection_name}>
                    <div
                        className={cn(
                            'relative flex w-40 h-4 m-2',
                            'text-xs text-white',
                            'cursor-pointer'
                        )}
                    >
                        { img ? <div className="h-4 rounded-lg overflow-hidden">
                            <img className="collection-img" src={config.ipfs + img} alt={collection_name} />
                        </div> : '' }
                        <div
                            className={cn(
                                "relative colletion-title-position h-5 my-0 mx-2",
                                "lg:h-8 text-center font-bold"
                            )}
                        >{name}</div>
                    </div>
                </Link>
                <div className={"h-60 cursor-pointer"}>
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
    );
}

export default CollectionPreview;
