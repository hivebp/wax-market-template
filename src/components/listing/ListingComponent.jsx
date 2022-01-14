import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { getListing } from '../../api/fetch'
import config from '../../config.json'
import { useUAL } from '../../hooks/ual'
import AssetDetails from '../asset/AssetDetails'
import AssetImage from '../asset/AssetImage'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'
import { formatPrice } from '../helpers/Helpers'
import MarketButtons from '../marketbuttons'

const ListingComponent = (props) => {
    const [listing, setListing] = useState(props.listing)

    const ual = useUAL()
    const activeUser = ual['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null

    const [listed, setListed] = useState(false)
    const [bought, setBought] = useState(listing.state === 3 && listing.buyer && listing.buyer === userName)
    const [canceled, setCanceled] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const asset = listing.assets[0]

    const data = asset.data

    let description = `by ${asset.collection.name}${
        asset.template_mint ? ' - Mint #' + asset.template_mint : ''
    } - Buy for ${formatPrice(listing)}`

    const image = data.img ? config.ipfs + data.img : ''

    const title = `Check out ${asset.name}`

    useEffect(() => {
        if (userName) setBought(listing && listing.buyer && listing.buyer === userName)
    }, [userName])

    const handleBought = (buyInfo) => {
        if (buyInfo) {
            if (buyInfo['bought']) getListing(listing.sale_id).then((res) => setListing(res && res.success && res.data))

            if (buyInfo['error']) setError(buyInfo['error'])

            setBought(buyInfo['bought'])
        } else {
            setBought(false)
        }

        setIsLoading(false)
    }

    const handleCancel = (cancel) => {
        try {
            if (cancel) {
                setCanceled(cancel)
            }
        } catch (e) {
            console.error(e.message)
            setCanceled(false)
            setError(e.message)
        }
        setIsLoading(false)
    }

    return (
        <Page id="AssetPage">
            <Header title={title} description={description} image={image} />
            <div className={cn('container mx-auto pt-10')}>
                {listing.assets.map((asset) => (
                    <div className="grid grid-cols-6 gap-10 h-auto w-full">
                        <div className="col-start-2 col-span-2">
                            <AssetImage asset={asset} />
                        </div>
                        <div className="col-span-2">
                            <AssetDetails asset={asset} />
                        </div>
                    </div>
                ))}
                <MarketButtons
                    asset={asset}
                    listing={listing}
                    handleBought={handleBought}
                    handleCancel={handleCancel}
                    bought={bought}
                    listed={listed}
                    canceled={canceled}
                    setListed={setListed}
                    error={error}
                    setError={setError}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
                <div className="relative mt-20 mb-20 text-center">
                    <div className="m-auto h-1/4 leading-10">
                        <a className="text-primary" href={`https://wax.atomichub.io/market/sale/${listing.sale_id}`}>
                            View on Atomichub
                        </a>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default ListingComponent
