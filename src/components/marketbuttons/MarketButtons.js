import cn from 'classnames'
import React, { useContext } from 'react'
import CheckIndicator from '../check/CheckIndicator'
import { formatPrice } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'

export default function MarketButtons(props) {
    const asset = props['asset']
    const listing = props['listing']
    const sale = props['sale']

    const ual = props['ual'] ? props['ual'] : { activeUser: '' }
    const activeUser = ual['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null

    const handleList = props['handleList']
    const handleBought = props['handleBought']
    const handleCancel = props['handleCancel']
    const handleClaim = props['handleClaim']
    const handleBidPlaced = props['handleBidPlaced']
    const bought = props['bought']
    const bidPlaced = props['bidPlaced']
    const canceled = props['canceled']
    const listed = props['listed']
    const auctioned = props['auctioned']
    const setListed = props['setListed']
    const claimed = props['claimed']
    const error = props['error']
    const setError = props['setError']
    const isLoading = props['isLoading']
    const setIsLoading = props['setIsLoading']
    const page = props['page']

    const [state, dispatch] = useContext(Context)

    const performLogin = async () => {
        ual.showModal()
    }

    let { owner, asset_id, unboxer } = asset

    const cancel = async () => {
        let { sale_id } = listing ? listing : asset.sales && asset.sales.length > 0 && asset.sales[0]

        setError(null)
        setIsLoading(true)

        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: 'atomicmarket',
                            name: 'cancelsale',
                            authorization: [
                                {
                                    actor: userName,
                                    permission: activeUser['requestPermission'],
                                },
                            ],
                            data: {
                                sale_id: sale_id,
                            },
                        },
                    ],
                },
                {
                    expireSeconds: 300,
                    blocksBehind: 0,
                },
            )
            handleCancel(true)
        } catch (e) {
            console.error(e)
            setListed(false)
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const cancelAuction = async () => {
        let { auction_id } = listing ? listing : asset.auctions && asset.auctions.length > 0 && asset.auctions[0]

        setError(null)
        setIsLoading(true)

        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: 'atomicmarket',
                            name: 'cancelauct',
                            authorization: [
                                {
                                    actor: userName,
                                    permission: activeUser['requestPermission'],
                                },
                            ],
                            data: {
                                auction_id: auction_id,
                            },
                        },
                    ],
                },
                {
                    expireSeconds: 300,
                    blocksBehind: 0,
                },
            )
            handleCancel(true)
        } catch (e) {
            console.error(e)
            setListed(false)
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const claimAuction = async () => {
        let { auction_id } = listing ? listing : asset.auctions && asset.auctions.length > 0 && asset.auctions[0]

        setError(null)
        setIsLoading(true)

        try {
            await activeUser.signTransaction(
                {
                    actions: [
                        {
                            account: 'atomicmarket',
                            name: 'auctclaimbuy',
                            authorization: [
                                {
                                    actor: userName,
                                    permission: activeUser['requestPermission'],
                                },
                            ],
                            data: {
                                auction_id: auction_id,
                            },
                        },
                    ],
                },
                {
                    expireSeconds: 300,
                    blocksBehind: 0,
                },
            )
            handleClaim(true)
        } catch (e) {
            console.error(e)
            setListed(false)
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnboxed = (unboxed) => {
        if (unboxed && unboxed['unboxed']) {
            dispatch({ type: 'SET_UNBOXED', payload: true })
        }
        setIsLoading(false)
    }

    const unbox = () => {
        setIsLoading(true)
        dispatch({ type: 'SET_ASSET', payload: asset })
        dispatch({ type: 'SET_CALLBACK', payload: (unboxed) => handleUnboxed(unboxed) })
        dispatch({ type: 'SET_ACTION', payload: 'unbox' })
    }

    const claim = () => {
        setIsLoading(true)
        dispatch({ type: 'SET_ASSET', payload: asset })
        dispatch({ type: 'SET_CALLBACK', payload: (unboxed) => handleUnboxed(unboxed) })
        dispatch({ type: 'SET_ACTION', payload: 'claim' })
    }

    const buy = () => {
        setIsLoading(true)
        dispatch({ type: 'SET_ASSET', payload: listing })
        dispatch({ type: 'SET_CALLBACK', payload: (bought) => handleBought(bought) })
        dispatch({ type: 'SET_ACTION', payload: 'buy' })
    }

    const bid = async () => {
        dispatch({ type: 'SET_ASSET', payload: listing })
        dispatch({ type: 'SET_CALLBACK', payload: (bid) => handleBidPlaced(bid) })
        dispatch({ type: 'SET_ACTION', payload: 'bid' })
    }

    const sell = async () => {
        setIsLoading(true)
        dispatch({ type: 'SET_ASSET', payload: asset })
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleList(sellInfo) })
        dispatch({ type: 'SET_ACTION', payload: 'sell' })
    }

    const Container = ({ children, className }) => {
        return (
            <div className={cn('relative h-auto w-full', 'text-center font-bold text-white', className)}>
                {children}
            </div>
        )
    }

    const AssetButton = ({ onClick, children }) => {
        return (
            <div
                className={cn(
                    'flex flex-col',
                    'bg-primary py-1 px-8 text-secondary mt-3 mb-3 mx-auto',
                    'cursor-pointer text-sm font-bold leading-relaxed uppercase',
                    'rounded-3xl outline-none',
                )}
                onClick={onClick}
            >
                {children}
            </div>
        )
    }

    const sellField = (
        <Container className={cn('flex flex-col')}>
            <AssetButton onClick={sell}>Sell</AssetButton>
        </Container>
    )

    const popError = state && state.error && state.error['asset_id'] === asset_id ? state.error['error'] : null

    const disMissError = () => {
        if (popError) dispatch({ type: 'SET_ERROR', payload: null })
        setError(null)
    }

    if (listing) {
        const { listing_price, buyer, seller, auction_id, sale_id, claimed_by_buyer } = listing

        const formattedPrice = formatPrice(listing)

        const buyField = (
            <Container className={cn('flex flex-col')}>
                <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                <AssetButton className="relative text-center mx-auto top-0 left-0" onClick={buy}>
                    Buy
                </AssetButton>
            </Container>
        )

        const bidField = (
            <Container className={cn('flex flex-col')}>
                <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                <AssetButton className="relative text-center mx-auto top-0 left-0" onClick={bid}>
                    Bid
                </AssetButton>
            </Container>
        )

        const cancelField = (
            <Container className={cn('flex flex-col')}>
                <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                <AssetButton className="relative text-center mx-auto top-0 left-0" onClick={cancel}>
                    Cancel
                </AssetButton>
            </Container>
        )

        const claimAuctionField = (
            <Container className={cn('flex flex-col')}>
                <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                <AssetButton className="relative text-center mx-auto top-0 left-0" onClick={claimAuction}>
                    Claim
                </AssetButton>
            </Container>
        )

        const cancelAuctionField = (
            <Container className={cn('flex flex-col')}>
                <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                <AssetButton className="relative text-center mx-auto top-0 left-0" onClick={cancelAuction}>
                    Cancel
                </AssetButton>
            </Container>
        )

        const infoField = (
            <Container>
                <div className="relative py-0 px-1 text-xs w-full">{formattedPrice}</div>
            </Container>
        )

        const loginField = (action) => (
            <Container className={cn('flex flex-col')}>
                <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                <AssetButton onClick={performLogin}>{`${action} (LOGIN)`}</AssetButton>
            </Container>
        )

        const buyable = listing_price && (!userName || userName !== seller) && (!bought || bought === false) && owner
        const sellable =
            userName &&
            (userName === owner ||
                (listing && listing['buyer'] && listing['buyer'] === userName && !listing['auction_id'])) &&
            (!listing_price || bought) &&
            (!listed || bought || canceled) &&
            handleList
        const cancelable = userName && userName === seller && sale_id && !canceled
        const auctioncancelable = userName && userName === seller && auction_id && !canceled
        const biddable = auction_id && (!userName || userName !== seller) && owner && !(buyer === userName)
        const auctionclaimable =
            auction_id && listing['state'] === 3 && buyer === userName && !canceled && !claimed && !claimed_by_buyer

        const checked =
            (!sellable &&
                !cancelable &&
                !auctioncancelable &&
                !biddable &&
                !auctionclaimable &&
                listing &&
                listing['buyer'] &&
                listing['buyer'] === userName) ||
            (biddable && bidPlaced) ||
            claimed

        const disMissError = () => {
            if (popError) dispatch({ type: 'SET_ERROR', payload: null })
            setError(null)
        }

        return (
            <div className={cn('relative w-full h-20 mt-auto flex flex-wrap justify-between block')}>
                {isLoading ? <LoadingIndicator className="m-auto" /> : ''}
                {!isLoading && buyable ? (userName ? buyField : loginField('BUY')) : ''}
                {!isLoading && sellable ? sellField : ''}
                {!isLoading && checked ? <CheckIndicator /> : ''}
                {!isLoading && cancelable ? cancelField : ''}
                {!isLoading && auctioncancelable ? cancelAuctionField : ''}
                {!isLoading && auctionclaimable ? claimAuctionField : ''}
                {!isLoading && biddable && !checked ? (userName ? bidField : loginField('BID')) : ''}
                {!isLoading && !cancelable && !sellable && !buyable && listing_price && !canceled ? infoField : ''}
                {!isLoading && (error || popError) ? (
                    <div
                        className={cn(
                            'absolute bg-red-800 rounded p-4 mx-auto leading-5 flex justify-center',
                            'text-center font-medium text-xs z-30',
                            'border border-solid border-red-800 rounded outline-none',
                            'error-note-size',
                        )}
                        onClick={disMissError}
                    >
                        {error ? error : popError.message}
                    </div>
                ) : (
                    ''
                )}
            </div>
        )
    } else if (sale) {
        const formattedPrice = formatPrice(sale)

        return (
            <div className={cn('relative w-full h-20 mt-auto flex flex-wrap justify-between block')}>
                {isLoading ? (
                    <LoadingIndicator className="m-auto" />
                ) : (
                    <Container className={cn('flex flex-col')}>
                        <div className="relative py-0 px-1 text-md w-full">{formattedPrice}</div>
                    </Container>
                )}
                {!isLoading && (error || popError) ? (
                    <div
                        className={cn(
                            'absolute bg-gray-800 rounded p-4 mx-auto leading-5 flex justify-center',
                            'text-center font-medium text-xs z-30',
                            'border border-solid border-red-800 rounded outline-none',
                            'error-note-size',
                        )}
                        onClick={disMissError}
                    >
                        {error ? error : popError.message}
                    </div>
                ) : (
                    ''
                )}
            </div>
        )
    } else {
        const cancelField = (
            <Container>
                <div className="relative text-center ml-auto mr-auto top-0 left-0" onClick={cancel}>
                    Cancel
                </div>
            </Container>
        )
        const cancelAuctionField = (
            <Container>
                <div className="relative text-center ml-auto mr-auto top-0 left-0" onClick={cancelAuction}>
                    Cancel
                </div>
            </Container>
        )

        const unpackField = (
            <Container className={cn('flex flex-col')}>
                <AssetButton onClick={unbox}>Unbox</AssetButton>
            </Container>
        )

        const claimField = (
            <Container className={cn('flex flex-col')}>
                <AssetButton onClick={claim}>Claim</AssetButton>
            </Container>
        )

        const unpackable = userName && userName === owner && page === 'packs'

        const claimable = userName && userName === unboxer && page === 'unclaimed_packs'

        const sellable =
            userName &&
            (userName === owner || (listing && listing['buyer'] && listing['buyer'] === userName)) &&
            (!listed || bought || canceled) &&
            !unpackable &&
            !claimable

        const cancelable =
            userName === owner && asset.sales && asset.sales.length > 0 && !canceled && !unpackable && !claimable

        const auctioncancelable =
            auctioned && asset.auctions && asset.auctions.length > 0 && !canceled && !unpackable && !claimable

        return (
            <div className={cn('relative w-full h-20 mt-auto flex flex-wrap justify-between block')}>
                {isLoading ? <LoadingIndicator className="m-auto" /> : ''}
                {!isLoading && !cancelable && sellable ? sellField : ''}
                {!isLoading && unpackable ? unpackField : ''}
                {!isLoading && claimable ? claimField : ''}
                {!isLoading && cancelable ? cancelField : ''}
                {!isLoading && auctioncancelable ? cancelAuctionField : ''}
                {!isLoading && (error || popError) ? (
                    <div
                        className={cn(
                            'absolute bg-gray-800 rounded p-2 mx-auto leading-5 flex justify-center',
                            'text-center text-blue-700 text-xs z-30',
                            'border border-solid border-red-800 rounded outline-none',
                            'error-note-size',
                        )}
                        onClick={disMissError}
                    >
                        {error ? error : popError.message}
                    </div>
                ) : (
                    ''
                )}
            </div>
        )
    }
}
