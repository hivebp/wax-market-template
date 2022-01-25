import { ArrowLeft, ArrowRight } from '@material-ui/icons'
import cn from 'classnames'
import React, { useState } from 'react'
import ContentLoader from 'react-content-loader'
import { getAsset, getAuctionsById, getListingsById } from '../../api/fetch'
import config from '../../config.json'
import { withLazy } from '../../hoc/Lazy'
import { useUAL } from '../../hooks/ual'
import { AuctionTimer } from '../auction/AuctionTimer'
import Link from '../common/util/input/Link'
import SvgIcon from '../common/util/SvgIcon'
import { formatMintInfo } from '../helpers/Helpers'
import MarketButtons from '../marketbuttons'
import CardDetails from './CardDetails'
import CardImage from './CardImage'
import MoreOptions from './MoreOptions'

const AssetCardLoader = () => (
    <ContentLoader
        speed={2}
        width={224}
        height={402}
        viewBox="0 0 224 402"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        backgroundOpacity={0.06}
        foregroundOpacity={0.12}
    >
        <circle cx="16" cy="16" r="8" />
        <rect x="34" y="9" rx="3" ry="3" width="151" height="14" />
        <rect x="0" y="39" rx="3" ry="3" width="222" height="222" />
        <rect x="9" y="273" rx="3" ry="3" width="201" height="21" />
    </ContentLoader>
)
/**
 * @typedef {{listing?: any;assets: Asset[];index: number | string;sale?: string;page: string;}} AssetCardProps
 */

/**
 * @typedef {import('../../api/fetch').Asset} Asset
 */

/**
 * @type {React.FC<AssetCardProps>}
 */
export const AssetCard = (props) => {
    const [listing, setListing] = useState(props['listing'])

    const [assets, setAssets] = useState(props['assets'])

    const [selectedAsset, setSelectedAsset] = useState(0)

    /** @type {Asset} */
    const asset = assets[selectedAsset]

    const index = props['index']

    const [update, setUpdate] = useState({})
    const [frontVisible, setFrontVisible] = useState(true)
    const ual = useUAL()
    const userName = ual?.activeUser?.accountName ?? null
    const [showMenu, setShowMenu] = useState(false)
    const [error, setError] = useState(null)
    const [bought, setBought] = useState(false)
    const [canceled, setCanceled] = useState(false)
    const [claimed, setClaimed] = useState(false)
    const [bidPlaced, setBidPlaced] = useState(false)
    const [listed, setListed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [transferred, setTransferred] = useState(false)
    const sale = props['sale']
    const page = props['page']

    const { collection, asset_id, template_mint, name } = asset

    const { collection_name } = collection

    const auction_id = listing ? listing['auction_id'] : null
    const end_time = listing ? listing['end_time'] : null

    const sale_id = listing
        ? listing['sale_id']
        : asset.sales && asset.sales.length > 0
        ? asset.sales[0]['sale_id']
        : null

    const handleBought = (buyInfo) => {
        if (buyInfo) {
            if (buyInfo['bought'])
                setUpdate({
                    new_owner: userName,
                })

            if (buyInfo['error']) setError(buyInfo['error'])

            setBought(buyInfo['bought'])
        } else {
            setBought(false)
        }

        setIsLoading(false)
    }

    const handleBidPlaced = async (bidInfo) => {
        if (bidInfo) {
            if (bidInfo['error']) setError(bidInfo['error'])

            if (bidInfo['bidPlaced']) {
                setIsLoading(true)
                await new Promise((r) => setTimeout(r, 2000))
                getAuctionsById(asset.asset_id).then((res) => updateListing(res))
            }

            setBidPlaced(bidInfo['bidPlaced'])
        } else {
            setBidPlaced(false)
        }
    }

    const updateListing = (res) => {
        if (res) {
            setListing(res.data[0])
            setIsLoading(false)
        }
    }

    const handleList = async (sellInfo) => {
        if (sellInfo) {
            const wasListed = sellInfo['listed']
            const error = sellInfo['error']

            if (error) setError(error)

            if (wasListed) {
                await new Promise((r) => setTimeout(r, 2000))
                getListingsById(asset.asset_id).then((res) => updateListing(res))
            }

            setListed(wasListed)
        }
        setIsLoading(false)
    }

    const handleCancel = (cancel) => {
        try {
            if (cancel) {
                setCanceled(cancel)
                setListing(null)
            }

            setIsLoading(false)
        } catch (e) {
            console.error(e)
            setCanceled(false)
            setIsLoading(false)
            setError(e.message)
        }
    }

    const handleClaim = (claim) => {
        try {
            if (claim) {
                setClaimed(claim)
            }

            setIsLoading(false)
        } catch (e) {
            console.error(e)
            setClaimed(false)
            setIsLoading(false)
            setError(e.message)
        }
    }

    const handleTransfer = async (info) => {
        if (info) {
            const wasTransferred = info['transferred']
            const error = info['error']

            if (error) setError(error)

            if (wasTransferred) {
                await new Promise((r) => setTimeout(r, 2000))
                getAsset(asset.asset_id).then((res) => res && setAssets([res.data]))
            }

            setTransferred(wasTransferred)
        }
        setIsLoading(false)
    }

    const handleAuction = async (info) => {
        if (info) {
            const wasAuctioned = info['auctioned']
            const error = info['error']

            if (error) setError(error)

            if (wasAuctioned) {
                await new Promise((r) => setTimeout(r, 2000))
                getAsset(asset.asset_id).then((res) => res && setAssets([res.data]))
            }

            setListed(wasAuctioned)
        }
        setIsLoading(false)
    }

    let mintInfo = formatMintInfo(template_mint)

    const toggleShowMenu = () => {
        setShowMenu(!showMenu)
    }

    const toggleFront = () => {
        setFrontVisible(!frontVisible)
    }

    const nextAsset = () => {
        let index = selectedAsset + 1
        if (index === assets.length) index = 0
        setSelectedAsset(index)
    }

    const prevAsset = () => {
        let index = selectedAsset - 1
        if (index === -1) index = assets.length - 1
        setSelectedAsset(index)
    }

    return (
        <div
            className={cn(
                'relative w-asset mx-auto overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper',
            )}
            id={'AssetCard_' + index}
        >
            <div className={cn('flex justify-between my-2 px-2')}>
                <Link href={'/collection/' + collection_name}>
                    <div
                        className={cn(
                            'relative flex items-center leading-4',
                            'text-white leading-relaxed text-sm',
                            'cursor-pointer',
                        )}
                    >
                        {collection['img'] ? (
                            <div className="h-4 rounded-lg overflow-hidden">
                                <img src={config.ipfs + collection['img']} className="collection-img" alt="none" />
                            </div>
                        ) : null}
                        <div className="font-light ml-2 mr-auto opacity-80 hover:opacity-100 truncate">
                            {collection_name}
                        </div>
                    </div>
                </Link>
                <div
                    onClick={toggleShowMenu}
                    className={cn(
                        'w-5 h-5 z-30',
                        'text-white leading-snug cursor-pointer',
                        'opacity-70 hover:opacity-100',
                    )}
                >
                    <img
                        className={cn(
                            'transition transform duration-250',
                            { 'rotate-90': showMenu },
                            { 'rotate-0': !showMenu },
                        )}
                        src="/more.svg"
                        alt="moreSvg"
                    />
                </div>
            </div>
            <MoreOptions
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                asset={asset}
                handleTransfer={handleTransfer}
                handleAuction={handleAuction}
                listed={listed}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                transferred={transferred}
            />
            <CardDetails visible={!frontVisible} asset={asset} update={update} />
            {assets.length > 1 && (
                <div
                    className={cn(
                        'absolute left-1 w-16 h-8 bottom-16 bg-transparent',
                        'cursor-pointer outline-none opacity-80',
                        'hover:opacity-100 z-10',
                    )}
                >
                    {`Bundle ${selectedAsset + 1}/${assets.length}`}
                </div>
            )}
            <div className={cn('aspect-w-1 aspect-h-1 overflow-hidden cursor-pointer', { hidden: !frontVisible })}>
                {assets.length > 1 && (
                    <div
                        className={cn(
                            'absolute left-0 w-8 h-8 mr-auto bg-transparent',
                            'cursor-pointer outline-none opacity-80',
                            'hover:opacity-100',
                            'back-button z-10',
                        )}
                        onClick={prevAsset}
                    >
                        <img src={'/arrow-ios-back-outline.svg'} alt="<" />
                    </div>
                )}
                <Link
                    href={
                        sale_id ? `/listing/${sale_id}` : auction_id ? `/auction/${auction_id}` : `/asset/${asset_id}`
                    }
                >
                    <div className="flex flex-1 justify-center h-full">
                        <CardImage asset={asset} index={selectedAsset} />
                    </div>
                </Link>
                {assets.length > 1 && (
                    <div
                        className={cn(
                            'absolute w-8 h-8 ml-auto bg-transparent',
                            'cursor-pointer outline-none opacity-80',
                            'hover:opacity-100',
                            'forward-button z-10',
                        )}
                        onClick={nextAsset}
                    >
                        <img src={'/arrow-ios-forward-outline.svg'} alt=">" />
                    </div>
                )}
            </div>

            <Link href={sale_id ? `/listing/${sale_id}` : auction_id ? `/auction/${auction_id}` : `/asset/${asset_id}`}>
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
                    {frontVisible ? <div className="absolute -top-3 left-22">{mintInfo}</div> : ''}
                </div>
            </Link>

            {frontVisible ? (
                <MarketButtons
                    asset={asset}
                    listing={listing}
                    bidPlaced={bidPlaced}
                    sale={sale}
                    update={update}
                    handleList={handleList}
                    handleBought={handleBought}
                    handleCancel={handleCancel}
                    handleClaim={handleClaim}
                    handleBidPlaced={handleBidPlaced}
                    bought={bought}
                    canceled={canceled}
                    claimed={claimed}
                    error={error}
                    setError={setError}
                    listed={listed}
                    setListed={setListed}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    page={page}
                />
            ) : null}

            <div
                className={cn(
                    'absolute w-8 h-8 bottom-0 bg-transparent',
                    'cursor-pointer outline-none opacity-80',
                    'hover:opacity-100',
                    { 'right-0': frontVisible },
                    { 'left-0': !frontVisible },
                )}
                onClick={toggleFront}
            >
                {frontVisible ? (
                    <SvgIcon icon={<ArrowLeft fontSize="large" />} />
                ) : (
                    <SvgIcon icon={<ArrowRight fontSize="large" />} />
                )}
            </div>

            {canceled ? null : <AuctionTimer endTime={end_time} />}
        </div>
    )
}

export default withLazy(AssetCard, AssetCardLoader)
