import cn from 'classnames'
import Link from '../common/util/input/Link'
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { Context } from '../marketwrapper'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import Input from '../common/util/input/Input'
import Button from '../common/util/input/Button'
import { getAccountStats, getWhiteList } from '../api/Api'

const DropButtons = (props) => {
    const drop = props['drop']
    const preview = props['preview']
    const handleBought = props['handleBought']
    const setIsLoading = props['setIsLoading']
    const setError = props['setError']
    const error = props['error']
    const isLoading = props['isLoading']

    const ual = props['ual'] ? props['ual'] : { activeUser: '' }
    const activeUser = ual['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null

    const [dropInterval, setDropInterval] = useState(null)
    const [dropTimeLeft, setDropTimeLeft] = useState('')
    const [dropReady, setDropReady] = useState(false)
    const [dropEnded, setDropEnded] = useState(false)
    const soldOut = drop.maxClaimable > 0 && drop.currentClaimed === drop.maxClaimable
    const [claimAmount, setClaimAmount] = useState(1)
    const [accountStats, setAccountStats] = useState(null)
    const [whitelist, setWhitelist] = useState(null)

    const [state, dispatch] = useContext(Context)

    const accountLimit = whitelist && whitelist.account_limit > 0 ? whitelist.account_limit : drop.accountLimit

    const claim = () => {
        if (claimAmount) {
            setIsLoading(true)
            dispatch({ type: 'SET_ASSET', payload: drop })
            dispatch({ type: 'SET_AMOUNT', payload: claimAmount })
            dispatch({ type: 'SET_CALLBACK', payload: (bought) => handleBought(bought) })
            dispatch({ type: 'SET_ACTION', payload: 'buy_drop' })
        }
    }

    const changeAmount = (e) => {
        const val = e.target.value
        if (/^\d*$/.test(val)) {
            let maxAmount = val ? parseInt(val) : ''
            if (!maxAmount) {
                setClaimAmount('')
            } else if (accountLimit && accountLimit < maxAmount) {
                setClaimAmount(accountLimit)
            } else if (drop.maxClaimable && drop.maxClaimable - drop.currentClaimed < maxAmount) {
                setClaimAmount(drop.maxClaimable - drop.currentClaimed)
            } else {
                setClaimAmount(maxAmount)
            }
        }
    }

    const disMissError = () => {
        setError(null)
    }

    useEffect(() => {
        if (userName && !preview) {
            getAccountStats(userName, drop.dropId).then(setAccountStats)
            getWhiteList(drop.dropId, userName).then(setWhitelist)
        }
    }, [userName])

    useEffect(() => {
        const currentTime = moment()

        if (soldOut) {
            return
        }

        if (drop.endTime && currentTime.unix() > drop.endTime) {
            setDropEnded(true)
            return
        }

        const diffTime = drop.startTime - currentTime.unix()

        if (diffTime > 0) {
            if (dropInterval) {
                clearInterval(dropInterval)
            }

            let duration = moment.duration(diffTime * 1000, 'milliseconds')
            const interval = 1000

            setDropInterval(
                setInterval(function () {
                    duration = moment.duration(duration - interval, 'milliseconds')

                    if (dropInterval) {
                        clearInterval(dropInterval)
                    }

                    if (duration.asSeconds() < 0) setDropTimeLeft(null)
                    else
                        setDropTimeLeft(
                            `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`,
                        )
                }, interval),
            )
        } else {
            setDropReady(true)
        }
    }, [dropReady === false])

    const free = drop && drop.listingPrice && drop.listingPrice === '0 NULL'

    return (
        <div>
            <div>
                <p className={cn('text-center text-neutral py-0 px-3 text-md w-full')}>
                    {free ? 'Free' : drop.listingPrice}
                </p>
                <p className={cn('text-center text-neutral py-0 px-3 text-md w-full')}>
                    {drop.authRequired ? 'Authorization Required' : ''}
                </p>
            </div>
            <div>
                <p
                    className={cn(
                        'w-full pt-4 px-3',
                        'text-center text-sm font-light text-neutral',
                        'overflow-visible',
                    )}
                >
                    Account Limit: {accountLimit}
                </p>
            </div>
            {accountStats ? (
                <div>
                    <p
                        className={cn(
                            'w-full pt-4 px-3',
                            'text-center text-sm font-light text-neutral',
                            'overflow-visible',
                        )}
                    >
                        Remaining Claims: {accountLimit - accountStats.counter}
                    </p>
                </div>
            ) : (
                ''
            )}
            {!isLoading && error ? (
                <div
                    className={cn(
                        'absolute bg-red-800 rounded p-4 mx-auto leading-5 flex justify-center',
                        'text-center font-medium text-xs z-30',
                        'border border-solid border-red-800 rounded outline-none',
                        'error-note-size',
                    )}
                    onClick={disMissError}
                >
                    {error}
                </div>
            ) : (
                ''
            )}
            {!dropEnded && !soldOut && (
                <div className={cn('text-center cursor-pointer')}>
                    {preview ? (
                        <Link href={`/drop/${drop.dropId}`}>
                            <div>Drop Live</div>
                        </Link>
                    ) : isLoading ? (
                        <div className={'h-16'}>
                            <LoadingIndicator />
                        </div>
                    ) : (
                        <div className={cn('relative m-auto px-2 mt-2 h-16', 'flex flex-wrap justify-around')}>
                            <Input
                                type="text"
                                className="w-1/4 border bg-transparent border-gray-700"
                                placeholder="Amount"
                                onChange={changeAmount}
                                value={claimAmount ? claimAmount : ''}
                            />
                            <Button
                                className={cn(
                                    'py-1 px-8 mt-3 mb-3',
                                    'cursor-pointer text-sm font-bold leading-relaxed uppercase',
                                    'rounded-3xl outline-none',
                                    {
                                        'bg-primary text-secondary':
                                            dropReady && (!accountStats || accountLimit - accountStats.counter > 0),
                                    },
                                    {
                                        'bg-gray-600 text-neutral':
                                            !dropReady || (accountStats && accountLimit - accountStats.counter <= 0),
                                    },
                                )}
                                onClick={userName ? claim : ual.showModal}
                                disabled={!dropReady || (accountStats && accountLimit - accountStats.counter <= 0)}
                            >
                                {dropTimeLeft && !dropReady
                                    ? dropTimeLeft
                                    : userName
                                    ? free
                                        ? 'Claim'
                                        : 'Purchase'
                                    : 'Login'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
            {dropEnded && (
                <div className={cn('text-center')}>
                    <div>Drop Ended</div>
                </div>
            )}
            {soldOut && (
                <div className={cn('text-center')}>
                    <div>Sold Out</div>
                </div>
            )}
        </div>
    )
}

export default DropButtons
