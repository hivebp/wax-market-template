import cn from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useAssets } from '../../api/api_hooks'
import { useUAL } from '../../hooks/ual'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import SelectableAssetPreview from './SelectableAssetPreview'

/**
 * @typedef {import('../../api/fetch').Asset} Asset
 */

/** @type {React.FC<{ templatesNeeded: import('../../api/fetch').Template[], selectedAssets: Asset[], setSelectedAssets: (assets: Asset[]) => void }>} */
const MyAssetList = ({ templatesNeeded, setSelectedAssets, selectedAssets }) => {
    const ual = useUAL()
    const userName = useMemo(() => ual?.activeUser?.accountName ?? null, [ual])

    const selectedAssetIds = useMemo(() => selectedAssets.map((asset) => asset.asset_id), [selectedAssets])

    const neededCollections = useMemo(
        () => Array.from(new Set(templatesNeeded.map((template) => template.collection.collection_name))),
        [templatesNeeded],
    )

    const assetFilters = useMemo(
        () =>
            userName && neededCollections.length
                ? {
                      collections: neededCollections,
                      user: userName,
                      limit: 12,
                      sortBy: 'template_mint',
                      orderDir: 'desc',
                  }
                : undefined,
        [neededCollections, userName],
    )
    const { data: assets, loading: isLoading } = useAssets(assetFilters)

    const toggleAsset = useCallback(
        /** @type {(asset: Asset) => void} */ (asset) => {
            const index = selectedAssets.findIndex((selected) => selected.asset_id === asset.asset_id)
            if (index === -1) return setSelectedAssets([...selectedAssets, asset])
            const newSelectedAssets = [...selectedAssets]
            newSelectedAssets.splice(index, 1)
            setSelectedAssets(newSelectedAssets)
        },
        [selectedAssets],
    )

    return (
        <div className={cn('w-full grid grid-cols-4 md:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-10')}>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                assets.map((asset) => (
                    <SelectableAssetPreview
                        asset={asset}
                        selectAsset={toggleAsset}
                        selected={selectedAssetIds.includes(asset.asset_id)}
                    />
                ))
            )}
        </div>
    )
}

export default MyAssetList
