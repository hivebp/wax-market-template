import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { getAssets } from '../../api/fetch'
import config from '../../config.json'
import AssetCard from '../assetcard/AssetCard'
import MarketContent from '../common/layout/Content'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'
import ScrollUpIcon from '../common/util/ScrollUpIcon'
import Filters from '../filters/Filters'
import { getFilters, getValues } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import Pagination from '../pagination/Pagination'

const Inventory = (props) => {
    const [state, dispatch] = useContext(Context)

    const [assets, setAssets] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const user = props['user']

    const values = getValues()
    values['user'] = props['user']

    const initialized = state.collections !== null && state.collections !== undefined

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false)

    const getAssetsResult = (result) => {
        setAssets(result)
        setIsLoading(false)
    }

    const initInventory = async (page) => {
        setIsLoading(true)
        getAssets(getFilters(values, state.collections, page)).then((result) => getAssetsResult(result))
    }

    useEffect(() => {
        if (initialized) initInventory(page)
    }, [page, initialized])

    const handleScroll = (e) => {
        let element = e.target

        if (element.id === 'MarketPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight)
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: true })
            }
        }
    }

    const scrollUp = () => {
        if (typeof window === 'undefined') {
            const element = document.getElementById('MarketPage')
            element.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
        }
    }

    const title = `${user}'s Inventory`

    const description = `Check out ${user}'s Inventory on ${config.market_title}`

    return (
        <Page onScroll={(e) => handleScroll(e)} id="MarketPage">
            <Header title={title} description={description} image={config.market_image} />
            <MarketContent>
                <div className={cn('w-full sm:1/3 md:w-1/4 md:ml-4 mx-auto p-0 md:p-5', 'max-w-filter')}>
                    <Filters {...props} searchPage={'inventory'} />
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
            </MarketContent>
            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : ''}
        </Page>
    )
}

export default Inventory
