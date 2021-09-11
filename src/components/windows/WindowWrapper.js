import React, {useContext, useEffect, useRef} from 'react';

import SellWindow from "./SellWindow";
import BuyWindow from "./BuyWindow";
import BuyDropWindow from "./BuyDropWindow";
import TransferWindow from "./TransferWindow";
import { Context } from "../marketwrapper";
import BidWindow from "./BidWindow";
import AuctionWindow from "./AuctionWindow";

function WindowWrapper(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [ state, dispatch ] = useContext(Context);

    const asset = state.asset;
    const amount = state.amount;

    const triggered = state.triggered;

    const action = state.action;
    const callBack = state.callBack;

    function useOutsideAlerter(ref, callBack, triggered) {
      useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
          if (!triggered && ref.current && !ref.current.contains(event.target) && event.target['className'] !== 'Dropdown-option'
              && event.target['className'] !== 'Dropdown-option is-selected' && event.target['className'] !== 'ErrorIcon'
              && event.target['className'] !== 'ErrorMessage' && event.target['className'] !== 'ErrorItem') {
              dispatch({ type: 'SET_ACTION', payload: '' });
              callBack();
              event.preventDefault();
              event.stopPropagation();
          }
        }
        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("click", handleClickOutside);
        };
      }, [action]);
    }

    function OutsideAlerter(props) {
        const wrapperRef = useRef(null);
        const callBack = props['callBack'];
        const triggered = props['triggered'];
        useOutsideAlerter(wrapperRef, callBack, triggered);

        return <div ref={wrapperRef}>{props.children}</div>;
    }

    const sellWindow = <OutsideAlerter
            callBack={callBack}
            triggered={triggered}
        >
        <SellWindow
            asset={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={callBack}
        />
    </OutsideAlerter>;

    const buyWindow = <OutsideAlerter
        callBack={callBack}
        triggered={triggered}
    >
        <BuyWindow
            listing={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={callBack}
        />
    </OutsideAlerter>;

    const buyDropWindow = <OutsideAlerter
        callBack={callBack}
        triggered={triggered}
    >
        <BuyDropWindow
            drop={asset}
            amount={amount}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={callBack}
        />
    </OutsideAlerter>;

    const auctionWindow = <OutsideAlerter
        callBack={callBack}
        triggered={triggered}
    >
        <AuctionWindow
            asset={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={callBack}
        />
    </OutsideAlerter>;

    const bidWindow = <OutsideAlerter
        callBack={callBack}
        triggered={triggered}
    >
        <BidWindow
            listing={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={callBack}
        />
    </OutsideAlerter>;

    const transferWindow = <OutsideAlerter
        callBack={callBack}
        triggered={triggered}
    >
        <TransferWindow
            asset={asset}
            ual={ual}
            closeCallBack={() => {
                dispatch({ type: 'SET_RECEIVER', payload: '' });
                dispatch({ type: 'SET_ACTION', payload: '' });
            }}
            callBack={(transferred) => {
                callBack(transferred);
                dispatch({ type: 'SET_RECEIVER', payload: '' });
            }}
        />
    </OutsideAlerter>;

    useEffect(() => {
        dispatch({ type: 'SET_TRIGGERED', payload: '' });
    }, [action]);

    return (
        <div className="relative">
            {action === 'buy' ? buyWindow : ''}
            {action === 'buy_drop' ? buyDropWindow : ''}
            {action === 'auction' ? auctionWindow : ''}
            {action === 'bid' ? bidWindow : ''}
            {action === 'sell' ? sellWindow : ''}
            {action === 'transfer' ? transferWindow : ''}
        </div>
    );
}

export default WindowWrapper;
