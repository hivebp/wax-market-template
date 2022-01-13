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

/**
 *
 * @param {{
 *  ual: {}
 * }} props
 * @returns
 */
function WindowWrapper(props) {
    const ual = props['ual'] ? props['ual'] : { activeUser: null }

    const [state, dispatch] = useContext(Context)

    const asset = state.asset
    const amount = state.amount

    const action = state.action
    const callBack = state.callBack

    function useOutsideAlerter(ref, callBack) {
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
                    callBack()
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
        }, [action])
    }

    function OutsideAlerter(props) {
        const wrapperRef = useRef(null)
        const callBack = props['callBack']
        useOutsideAlerter(wrapperRef, callBack)

        return <div ref={wrapperRef}>{props.children}</div>
    }

    const sellWindow = (
        <OutsideAlerter callBack={callBack}>
            <SellWindow
                asset={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const buyWindow = (
        <OutsideAlerter callBack={callBack}>
            <BuyWindow
                listing={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const buyDropWindow = (
        <OutsideAlerter callBack={callBack}>
            <BuyDropWindow
                drop={asset}
                amount={amount}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const auctionWindow = (
        <OutsideAlerter callBack={callBack}>
            <AuctionWindow
                asset={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const unboxWindow = (
        <OutsideAlerter callBack={callBack}>
            <UnboxWindow
                asset={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const claimWindow = (
        <OutsideAlerter callBack={callBack}>
            <ClaimPopup
                asset={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const bidWindow = (
        <OutsideAlerter callBack={callBack}>
            <BidWindow
                listing={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_ACTION', payload: '' })
                }}
                callBack={callBack}
            />
        </OutsideAlerter>
    )

    const transferWindow = (
        <OutsideAlerter callBack={callBack}>
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
        </OutsideAlerter>
    )

    useEffect(() => {
        dispatch({ type: 'SET_TRIGGERED', payload: '' })
    }, [action])

    return (
        <div className="absolute">
            {action === 'buy' ? buyWindow : ''}
            {action === 'unbox' ? unboxWindow : ''}
            {action === 'claim' ? claimWindow : ''}
            {action === 'buy_drop' ? buyDropWindow : ''}
            {action === 'auction' ? auctionWindow : ''}
            {action === 'bid' ? bidWindow : ''}
            {action === 'sell' ? sellWindow : ''}
            {action === 'transfer' ? transferWindow : ''}
        </div>
    )
}

export default WindowWrapper
