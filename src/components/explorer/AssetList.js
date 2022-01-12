import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { getAssets } from '../../api/fetch'
import AssetCard from '../assetcard/AssetCard'
import AssetListContent from '../common/layout/Content'
import Filters from '../filters/Filters'
import { getFilters, getValues } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import Pagination from '../pagination/Pagination'

function AssetList(props) {
    const [state, dispatch] = useContext(Context)

    const [assets, setAssets] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const values = getValues()

    const initialized = state.collections !== null && state.collections !== undefined

    const getAssetResult = (result) => {
        setAssets(result)
        setIsLoading(false)
    }

    const initAssets = async (page) => {
        setIsLoading(true)

        getAssets(getFilters(values, state.collections, page)).then((result) => getAssetResult(result))
    }

    useEffect(() => {
        if (initialized) initAssets(page)
    }, [page, initialized])

    return (
        <AssetListContent>
            <div className={cn('w-full sm:1/3 md:w-1/4 md:ml-4 mx-auto p-0 md:p-5', 'max-w-filter')}>
                <Filters {...props} searchPage={'assets'} />
            </div>
            <div className={cn('w-full sm:2/3 md:w-3/4')}>
                <Pagination items={assets && assets.data} page={page} setPage={setPage} />
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <div
                        className={cn(
                            'relative w-full mb-24',
                            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
                        )}
                    >
                        {assets && assets['success']
                            ? assets['data'].map((asset, index) => (
                                  <AssetCard {...props} key={index} index={index} assets={[asset]} />
                              ))
                            : ''}
                    </div>
                )}
                {isLoading ? '' : <Pagination items={assets && assets.data} page={page} setPage={setPage} />}
            </div>
        </AssetListContent>
    )
}

export default AssetList
