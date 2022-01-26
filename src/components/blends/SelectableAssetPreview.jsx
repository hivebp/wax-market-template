import cn from 'classnames'
import React from 'react'
import CardImage from '../assetcard/CardImage'
import CollectionTitle from '../assetcard/CollectionTitle'
import { MintInfo } from '../helpers/Helpers'

/**
 * @typedef {Object} SelectableAssetPreviewProps
 * @property {import('../../api/fetch').Asset} asset
 * @property {(asset: import('../assetcard/AssetCard').Asset) => void} selectAsset
 * @property {boolean} selected
 */

/** @type {React.FC<SelectableAssetPreviewProps>} */
export const SelectableAssetPreview = ({ asset, selectAsset, selected }) => {
    const { collection, asset_id, template_mint, name } = asset

    return (
        <div
            className={cn(
                'relative w-full mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border',
                'transition-all',
                { 'border-primary bg-primary bg-opacity-40': selected },
                { 'bg-paper': !selected },
            )}
            onClick={() => selectAsset(asset)}
        >
            <div className={cn('flex justify-between my-2 px-2')}>
                <CollectionTitle collection={collection} hasLink={false} />
            </div>
            <div className={cn('aspect-w-1 aspect-h-1 overflow-hidden cursor-pointer')}>
                <div className="flex flex-1 h-full">
                    <CardImage asset={asset} />
                </div>
            </div>

            <div className="relative">
                <p
                    className={cn(
                        'w-full pt-4 px-2 mb-5 overflow-visible',
                        'text-center text-base font-light text-neutral',
                    )}
                >
                    {name ? name : asset_id}
                </p>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <MintInfo mint={template_mint} />
                </div>
            </div>
        </div>
    )
}

export default SelectableAssetPreview
