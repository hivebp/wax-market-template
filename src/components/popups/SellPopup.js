import React, {useEffect, useState} from 'react';
import cn from "classnames";
import PopupButton from './PopupButton';
import PopupContent from './PopupContent';

import {
    formatNumber
} from '../helpers/Helpers';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";

function SellPopup(props) {
    const asset = props['asset'];

    const {collection, schema, name, data, asset_id} = asset;

    const image = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';

    const video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];
    const [sellPrice, setSellPrice] = useState(0);

    useEffect(() => {
    }, []);

    const sell = async () => {
        if (!sellPrice)
            return;
        const quantity = parseFloat(sellPrice);
        closeCallBack();
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'atomicmarket',
                    name: 'announcesale',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        seller: userName,
                        maker_marketplace: config.market_name,
                        settlement_symbol: '8,WAX',
                        asset_ids: [asset_id],
                        listing_price: quantity.toFixed(8)+' WAX'
                    },
                }, {
                    account: 'atomicassets',
                    name: 'createoffer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        sender: userName,
                        recipient: 'atomicmarket',
                        sender_asset_ids: [asset_id],
                        recipient_asset_ids: [],
                        memo: 'sale'
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({listed: true, price: quantity});
        } catch (e) {
            callBack({listed: false, error: e});
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({listed: false, offer: 0});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    let cut = sellPrice - (0.04 * sellPrice);
    if (collection['market_fee'])
        cut = cut - collection['market_fee'] * sellPrice;

    return (
        <div className={cn(
            'fixed top-40 left-popup',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4 " onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl text-center">{name}</div>
            <PopupContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-lg text-left my-4">
                {`Are you sure you want to sell ${name} for ${formatNumber(sellPrice)} WAX `}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className={cn(
                'relative l-0 m-auto h-20 lg:h-8',
                'flex justify-evenly flex-wrap lg:justify-end'
            )}>
                <input className={"SellInput Memo"} type="text" placeholder="Price" onChange={changePrice} value={sellPrice ? sellPrice : ''}/>
                <PopupButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                <PopupButton text="Sell" onClick={sell} />
            </div>
            {collection['market_fee'] || collection['market_fee'] === 0 ?
                <div className="SellCalc">
                    <div>Market Fee: 2%</div>
                    <div>WAX Fee: 2%</div>
                    <div>Collection Fee: {collection['market_fee'] * 100}%</div>
                    <div>Your Cut: {cut} WAX</div>
                </div> : <LoadingIndicator/>
            }

            {isLoading ? <div className="absolute t-0 l-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction"/>
            </div> : '' }
        </div>
    );
}

export default SellPopup;
