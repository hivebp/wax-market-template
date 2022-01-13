import cn from 'classnames'
import React, { useContext, useEffect } from 'react'
import CardImage from '../assetcard/CardImage'
import CollectionTitle from '../assetcard/CollectionTitle'
import { formatMintInfo } from '../helpers/Helpers'
import { Context } from '../marketwrapper'

function SelectableAssetPreview(props) {
    const index = props['index']
    const asset = props['asset']

    const templatesNeeded = props['templatesNeeded']

    const [state, dispatch] = useContext(Context)
    const selected = state.selectedAssets && state.selectedAssets.map((ass) => ass.asset_id).includes(asset.asset_id)

    useEffect(() => {}, [state.selectedAssets && state.selectedAssets.length])

    const addAsset = (asset) => {
        const selectedAssets = state.selectedAssets

        if (
            (!selectedAssets || !selectedAssets.map((ass) => ass.asset_id).includes(asset.asset_id)) &&
            templatesNeeded
                .map((template) => template.template.template_id.toString())
                .includes(asset.template.template_id.toString())
        ) {
            const newSelectedAssets = []
            selectedAssets &&
                selectedAssets.map((ass) => {
                    newSelectedAssets.push(ass)
                })

            newSelectedAssets.push(asset)

            dispatch({ type: 'SET_SELECTED_ASSETS', payload: newSelectedAssets })
        } else {
            const newSelectedAssets = []

            selectedAssets &&
                selectedAssets.map((ass) => {
                    if (ass.asset_id !== asset.asset_id) {
                        newSelectedAssets.push(ass)
                    }
                })

            dispatch({ type: 'SET_SELECTED_ASSETS', payload: newSelectedAssets })
        }
    }

    const { collection, asset_id, template_mint, name } = asset

    let mintInfo = formatMintInfo(template_mint)

    return (
        <div
            className={cn(
                'relative w-full mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border',
                'shadow-md bg-paper',
                { 'border-primary': selected },
            )}
            id={'AssetPreview_' + index}
            onClick={() => addAsset(asset)}
        >
            <div className={cn('flex justify-between my-2 px-2')}>
                <CollectionTitle collection={collection} hasLink={false} />
            </div>
            <div className={cn('aspect-w-1 aspect-h-1 overflow-hidden', 'cursor-pointer')}>
                <div className="flex flex-1 h-full">
                    <CardImage {...props} asset={asset} />
                </div>
            </div>

            <div className="relative">
                <p
                    className={cn(
                        'w-full pt-4 px-2 mb-5',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible',
                    )}
                >
                    {name ? name : asset_id}
                </p>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">{mintInfo}</div>
            </div>
        </div>
    )
}

export default SelectableAssetPreview
