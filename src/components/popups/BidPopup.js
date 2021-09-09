import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {formatNumber} from "../helpers/Helpers";
import cn from "classnames";
import PopupContent from "./PopupContent";
import config from "../../config.json";
import Bids from "../auctions/Bids";

function BidPopup(props) {

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

    const bidField = (<button className="PopupBidButton" onClick={bid}>Bid</button>);

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
            'fixed top-40 left-popup',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl text-center">{name}</div>
            <PopupContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-lg text-center my-4">
                {`Do you want to bid ${formatNumber(sellPrice)} WAX for this Item?`}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className={cn(
                'relative l-0 m-auto h-20 lg:h-8',
                'flex justify-evenly flex-wrap lg:justify-end'
            )}>
                <input className={"SellInput Memo"} type="text" placeholder="Price" onChange={changePrice} value={sellPrice ? sellPrice : ''}/>
                <button className="PopupCancelButton" onClick={closeCallBack}>Cancel</button>
                { userName !== seller ? bidField : '' }
            </div>
            <Bids
                bids={bids}
            />
            {isLoading ? <div className="Overlay"><LoadingIndicator text={'Loading Transaction'}/></div> : '' }
        </div>
    );
}

export default BidPopup;
