import React, { useContext, useEffect, useRef } from 'react'
import { Context } from '../marketwrapper'
import AuctionWindow from './AuctionWindow'
import BidWindow from './BidWindow'
import BuyDropWindow from './BuyDropWindow'
import BuyWindow from './BuyWindow'
import ClaimPopup from './ClaimWindow'
import SellWindow from './SellWindow'
import TransferWindow from './TransferWindow'
import UnboxWindow from './UnboxWindow'

const useOutsideAlerter = (ref, callback) => {
    const [, dispatch] = useContext(Context)
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (
                ref.current &&
                !ref.current.contains(event.target) &&
                event.target['className'] !== 'Dropdown-option' &&
                event.target['className'] !== 'Dropdown-option is-selected' &&
                event.target['className'] !== 'ErrorIcon' &&
                event.target['className'] !== 'ErrorMessage' &&
                event.target['className'] !== 'ErrorItem' &&
                event.target['id'] !== 'unbox-button' &&
                event.target['id'] !== 'stop-animation'
            ) {
                dispatch({ type: 'SET_ACTION', payload: '' })
                callback()
                event.preventDefault()
                event.stopPropagation()
            }
        }
        // Bind the event listener
        document.addEventListener('click', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('click', handleClickOutside)
        }
    }, [callback, dispatch])
}

const OutsideAlerter = (props) => {
    const wrapperRef = useRef(null)
    const callBack = props['callBack']
    useOutsideAlerter(wrapperRef, callBack)

    return <div ref={wrapperRef}>{props.children}</div>
}

const availableActions = ['buy', 'unbox', 'claim', 'buy_drop', 'auction', 'bid', 'sell', 'transfer']

const WindowWrapper = React.memo((props) => {
    const ual = props.ual ?? { activeUser: null }
    const [state, dispatch] = useContext(Context)
    const { asset, amount, action, callBack } = state

    useEffect(() => {
        dispatch({ type: 'SET_TRIGGERED', payload: '' })
    }, [action])

    // do not render anything if we don't need to
    if (!availableActions.includes(action)) return null

    return (
        <div className="absolute">
            <OutsideAlerter callBack={callBack}>
                {action === 'sell' ? (
                    <SellWindow
                        asset={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'buy' ? (
                    <BuyWindow
                        listing={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'buyDrop' ? (
                    <BuyDropWindow
                        drop={asset}
                        amount={amount}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'auction' ? (
                    <AuctionWindow
                        asset={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'unbox' ? (
                    <UnboxWindow
                        asset={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'claim' ? (
                    <ClaimPopup
                        asset={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'bid' ? (
                    <BidWindow
                        listing={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={callBack}
                    />
                ) : null}

                {action === 'transfer' ? (
                    <TransferWindow
                        asset={asset}
                        ual={ual}
                        closeCallBack={() => {
                            dispatch({ type: 'SET_RECEIVER', payload: '' })
                            dispatch({ type: 'SET_ACTION', payload: '' })
                        }}
                        callBack={(transferred) => {
                            callBack(transferred)
                            dispatch({ type: 'SET_RECEIVER', payload: '' })
                        }}
                    />
                ) : null}
            </OutsideAlerter>
        </div>
    )
})

export default WindowWrapper
