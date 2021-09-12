import React, {useEffect, useState} from 'react';
import cn from "classnames";
import WindowButton from './WindowButton';
import config from '../../config.json'

import {
    formatNumber
} from '../helpers/Helpers';

import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getDelphiMedian} from "../api/Api";
import {claimDropAction, purchaseDropAction} from "../wax/Wax";

function BuyDropWindow(props) {
    const drop = props['drop'];
    const amount = props['amount'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(null);
    const [delphiMedian, setDelphiMedian] = useState(0);

    const { name, listingPrice } = drop;

    const parseUSDListingPrice = (median, amount, usd) => {
        if (median) {
            setQuantity( (amount * usd) / (median / 10000.0));
            setDelphiMedian(median);
        }
    };

    useEffect(() => {
        if (listingPrice.includes(' WAX')) {
            setQuantity(amount * parseFloat(listingPrice.replace(' WAX', '')));
        } else if (listingPrice.includes(' USD')) {
            getDelphiMedian().then(res => parseUSDListingPrice(
                res, amount, parseFloat(listingPrice.replace(' USD', ''))));
        }
    }, []);

    const free = listingPrice === '0 NULL';

    const purchase = async () => {
        closeCallBack();
        setIsLoading(true);

        try {
            await purchaseDropAction(drop, quantity, delphiMedian, amount, activeUser);

            callBack({'bought': true});
        } catch (e) {
            callBack({'bought': false, 'error': e.message});
        } finally {
            setIsLoading(false);
        }
    };

    const claim = async () => {
        closeCallBack();
        setIsLoading(true);

        try {
            await claimDropAction(drop, amount, activeUser);

            callBack({'bought': true});
        } catch (e) {
            callBack({'bought': false, 'error': e.message});
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    return (
        <div className={cn(
            'fixed top-40 left-popup',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <div className="text-lg text-center my-4">
                {`Do you want to buy this Drop for ${formatNumber(quantity)} WAX`}
            </div>
            <div className={cn(
                'relative m-auto h-20 lg:h-8',
                'flex justify-evenly flex-wrap lg:justify-end'
            )}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                <WindowButton text={free ? "Claim" : "Purchase"} onClick={free ? claim : purchase} />
            </div>
            {isLoading ? <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction" />
            </div> : '' }
        </div>
    );
}

export default BuyDropWindow;
