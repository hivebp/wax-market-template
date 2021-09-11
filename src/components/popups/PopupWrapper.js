import React, {useContext, useEffect, useRef} from 'react';

import SellPopup from "./SellPopup";
import BuyPopup from "./BuyPopup";
import BuyDropPopup from "./BuyDropPopup";
import TransferPopup from "./TransferPopup";
import { Context } from "../marketwrapper";
import BidPopup from "./BidPopup";
import AuctionPopup from "./AuctionPopup";

function PopupWrapper(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [ state, dispatch ] = useContext(Context);

    const asset = state.asset;
    const amount = state.amount;

    const action = state.action;
    const callBack = state.callBack;

    function useOutsideAlerter(ref, callBack) {
      useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target) && event.target['className'] !== 'Dropdown-option'
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
      }, [ref]);
    }

    function OutsideAlerter(props) {
        const wrapperRef = useRef(null);
        const callBack = props['callBack'];
        useOutsideAlerter(wrapperRef, callBack);

        return <div ref={wrapperRef}>{props.children}</div>;
    }

    const sellWindow = <OutsideAlerter
            callBack={callBack}
        >
        <SellPopup
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
    >
        <BuyPopup
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
    >
        <BuyDropPopup
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
    >
        <AuctionPopup
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
    >
        <BidPopup
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
    >
        <TransferPopup
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

export default PopupWrapper;
