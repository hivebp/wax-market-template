import React, {useState} from 'react';

import ErrorMessage from "../common/util/ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {formatNumber} from "../helpers/Helpers";
import cn from "classnames";
import WindowButton from './WindowButton';
import WindowContent from "./WindowContent";
import Input from '../common/util/input/Input';
import config from "../../config.json";
import Bids from "../auctions/Bids";

function BidWindow(props) {

    const listing = props['listing'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];

    const { price, assets, seller, bids, auction_id } = listing;

    const asset = assets[0];

    const numBids = bids ? bids.length : 0;

    const {collection, schema, name, data} = asset;

    const image = data['img'] ? data['img'].includes('http') ? data['img'] : config.ipfs + data['img'] : '';
    const video = data['video'] ? data['video'].includes('http') ? data['video'] : config.ipfs + data['video'] : '';
    const listing_price = price['amount'] / (Math.pow(10, price['token_precision']));

    const [sellPrice, setSellPrice] = useState(
        !bids || bids.length === 0 ? listing_price : listing_price * 1.10000001);

    const validBid = (price) => {
        if (!price)
            return false;
        return price >= (numBids === 0 ? listing_price : listing_price * 1.10000001);
    };

    const bid = async () => {
        closeCallBack();
        if (!validBid(sellPrice)) {
            setError('Invalid Bid');
            return false;
        }
        const quantity = parseFloat(sellPrice);
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        to: 'atomicmarket',
                        memo: 'deposit',
                        quantity: `${quantity.toFixed(8)} WAX`,
                    },
                }, {
                    account: 'atomicmarket',
                    name: 'auctionbid',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        auction_id: auction_id,
                        bid: `${quantity.toFixed(8)} WAX`,
                        bidder: userName,
                        taker_marketplace: config.market_name
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({'bidPlaced': true});
        } catch (e) {
            setError(e.message);
            callBack({'bidPlaced': false, 'error': e.message});
        } finally {
            setIsLoading(false);
        }
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const cancel = () => {
        callBack({'bidPlaced': false});
        closeCallBack();
    };

    return (
        <div className={cn(
            'fixed top-40 left-popup lg:left-popup-lg',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <WindowContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <Bids
                bids={bids}
            />
            <div className="text-lg text-center my-4">
                {`Do you want to bid ${formatNumber(sellPrice)} WAX for this Item?`}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className={cn(
                'relative m-auto lg:mb-10 h-20 lg:h-8',
                'flex flex-row items-center justify-evenly flex-wrap'
            )}>
                <div className="flex items-center">Price</div>
                <div
                    className={cn(
                        'flex flex-row',
                        'items-center'
                    )}
                >
                    <Input
                        type="text"
                        className="w-full bg-gray-700"
                        placeholder="Price"
                        onChange={changePrice}
                        value={sellPrice ? sellPrice : ''}
                    />
                </div>
            </div>
            <div className={cn(
                'relative m-auto mt-5 h-20 lg:h-8',
                'flex flex-row justify-evenly flex-wrap lg:justify-end'
            )}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                { userName !== seller ? <WindowButton text="Bid" onClick={bid} /> : '' }
            </div>            
            {isLoading ? <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction"/>
            </div> : '' }
        </div>
    );
}

export default BidWindow;
