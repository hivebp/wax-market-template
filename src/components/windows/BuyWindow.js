import React, {useState} from 'react';
import cn from "classnames";
import WindowButton from './WindowButton';
import WindowContent from './WindowContent';
import config from '../../config.json'

import {
    formatNumber
} from '../helpers/Helpers';

import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {purchaseSaleAction} from "../wax/Wax";

function BuyWindow(props) {
    const listing = props['listing'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);

    const { price, assets, sale_id, seller, listing_symbol } = listing;

    const asset = assets[0];

    const { collection, schema, name, data } = asset;

    const { median, amount, token_precision } = price;

    const quantity = amount / (Math.pow(10, token_precision));

    const image = data['img'] ? data['img'].includes('http') ? data['img'] : config.ipfs + data['img'] : '';
    const video = data['video'] ? data['video'].includes('http') ? data['video'] : config.ipfs + data['video'] : '';

    const buy = async () => {
        closeCallBack();
        setIsLoading(true);

        try {
            await purchaseSaleAction(sale_id, listing_symbol, median, quantity, activeUser);

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
            'fixed top-1/2 transform -translate-y-1/2',
            'left-1/2 transform -translate-x-1/2',
            'w-11/12 max-w-popup lg:max-w-popup-lg h-auto',
            'max-h-popup md:max-h-popup-lg',
            'p-3 lg:p-8 m-0 overflow-y-auto',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-xl sm:text-2xl md:text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <WindowContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-base sm:text-lg text-center my-0 md:my-4">
                {`Do you want to buy this Item for ${formatNumber(quantity)} WAX?`}
            </div>
            <div className={cn(
                'relative m-auto mt-5 h-20 lg:h-8',
                'flex justify-evenly lg:justify-end'
            )}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                { userName !== seller ? <WindowButton text="Buy" onClick={buy} /> : '' }
            </div>
            {isLoading ? <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction" />
            </div> : '' }
        </div>
    );
}

export default BuyWindow;
