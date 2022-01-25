import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { useCollections } from '../../api/api_hooks'
import { getAuctions, getWonAuctions } from '../../api/fetch'
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

/**
 * @type {React.FC<{ bidder?: string, winner?: string }>}
 */
export const Auctions = (props) => {
    const { data: collections } = useCollections()
    const [, dispatch] = useContext(Context)

    const [listings, setListings] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const bidder = props['bidder']
    const winner = props['winner']

    const values = getValues()

    if (winner) values['winner'] = winner

    if (bidder) values['winner'] = bidder

    if (!values['sort']) values['sort'] = 'ending_asc'

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false)

    const getResult = (result) => {
        setListings(result)
        setIsLoading(false)
    }

    const initAuctions = async (page) => {
        setIsLoading(true)
        if (winner)
            getWonAuctions(getFilters(values, collections, 'auctions', page)).then((result) => getResult(result))
        else getAuctions(getFilters(values, collections, 'auctions', page)).then((result) => getResult(result))
    }

    useEffect(() => {
        if (collections.length) initAuctions(page)
    }, [page, collections.length])

    const handleScroll = (e) => {
        let element = e.target

        if (element.id === 'AuctionPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight)
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: true })
            }
        }
    }

    const scrollUp = () => {
        if (typeof window !== 'undefined') {
            const element = document.getElementById('AuctionPage')
            element?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
        }
    }

    return (
        <Page onScroll={(e) => handleScroll(e)} id="AuctionPage">
            <Header title={config.market_title} description={config.market_description} image={config.market_image} />
            <MarketContent>
                <div className={cn('w-full sm:1/3 md:w-1/4 md:ml-4 mx-auto p-0 md:p-5', 'max-w-filter')}>
                    <Filters
                        {...props}
                        defaultSort="ending_asc"
                        searchPage="auctions"
                        winner={winner}
                        bidder={bidder}
                        sortOptions={[
                            {
                                value: 'ending_desc',
                                label: 'Ending (Latest)',
                            },
                            {
                                value: 'ending_asc',
                                label: 'Ending (Soonest)',
                            },
                            {
                                value: 'created_desc',
                                label: 'Date (Newest)',
                            },
                            {
                                value: 'created_asc',
                                label: 'Date (Oldest)',
                            },
                            {
                                value: 'price_asc',
                                label: 'Price (Lowest)',
                            },
                            {
                                value: 'price_desc',
                                label: 'Price (Highest)',
                            },
                        ]}
                    />
                </div>
                <div className={cn('w-full sm:2/3 md:w-3/4')}>
                    <Pagination items={listings && listings.data} page={page} setPage={setPage} />
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <div
                            className={cn('relative w-full mb-24', 'grid gap-4')}
                            style={{
                                gridTemplateColumns: 'repeat( auto-fit, minmax(15rem, 1fr) )',
                            }}
                        >
                            {listings && listings['success']
                                ? listings['data'].map((listing, index) => (
                                      <AssetCard
                                          {...props}
                                          key={index}
                                          index={index}
                                          listing={listing}
                                          assets={listing.assets}
                                      />
                                  ))
                                : ''}
                        </div>
                    )}
                    {isLoading ? '' : <Pagination items={listings && listings.data} page={page} setPage={setPage} />}
                </div>
            </MarketContent>
            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : ''}
        </Page>
    )
}

export default Auctions
