import React, {useState} from 'react';
import cn from "classnames";
import WindowButton from './WindowButton';
import WindowContent from "./WindowContent";
import Input from '../common/util/input/Input';

import {formatNumber} from '../helpers/Helpers'

import ErrorMessage from "../common/util/ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";
import {announceAuctionAction} from "../wax/Wax";


function AuctionWindow(props) {
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
    const [days, setDays] = useState(1);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    let cut = sellPrice - (0.04 * sellPrice);
    if (collection['market_fee'])
        cut = cut - collection['market_fee'] * sellPrice;

    const auction = async () => {
        if (!sellPrice)
            return;
        const quantity = parseFloat(sellPrice);
        closeCallBack();
        setIsLoading(true);
        try {
            await announceAuctionAction(asset_id, days, hours, minutes, quantity, activeUser);
            callBack({auctioned: true});
        } catch (e) {
            callBack({auctioned: false, error: e.message});
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({auctioned: false});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const changeHours = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setHours(val);
    };

    const changeMinutes = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setMinutes(val);
    };

    const changeDays = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setDays(val);
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
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4 " onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-xl sm:text-2xl md:text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <WindowContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-base sm:text-lg text-center my-0 md:my-4">
                {`Are you sure you want to auction ${name} for ${formatNumber(sellPrice)} WAX?`}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="relative">
                <div className="flex flex-row">
                    <div className={cn(
                        'relative m-auto lg:mb-2 py-1 w-1/2 mr-4',
                        'flex flex-row items-center justify-between flex-wrap'
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
                        'relative m-auto lg:mb-2 py-1 w-1/2',
                        'flex flex-row items-center justify-between flex-wrap'
                    )}>
                        <div className="flex items-center">Days</div>
                        <div
                            className={cn(
                                'flex flex-row',
                                'items-center'
                            )}
                        >
                            <Input
                                type="text"
                                className="w-full bg-gray-700"
                                placeholder="Days"
                                onChange={changeDays}
                                value={days ? days : ''}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className={cn(
                        'relative m-auto lg:mb-2 py-1 w-1/2 mr-4',
                        'flex flex-row items-center justify-between flex-wrap'
                    )}>
                        <div className="flex items-center">Hours</div>
                        <div
                            className={cn(
                                'flex flex-row',
                                'items-center'
                            )}
                        >
                            <Input
                                type="text"
                                className="w-full bg-gray-700"
                                placeholder="Hours"
                                onChange={changeHours}
                                value={hours ? hours : ''}
                            />
                        </div>
                    </div>
                    <div className={cn(
                        'relative m-auto lg:mb-2 py-1 w-1/2',
                        'flex flex-row items-center justify-between flex-wrap'
                    )}>
                        <div className="flex items-center">Minutes</div>
                        <div
                            className={cn(
                                'flex flex-row',
                                'items-center'
                            )}
                        >
                            <Input
                                type="text"
                                className="w-full bg-gray-700"
                                placeholder="Minutes"
                                onChange={changeMinutes}
                                value={minutes ? minutes : ''}
                            />
                        </div>
                    </div>
                </div>
                {collection['market_fee'] || collection['market_fee'] === 0 ?
                    <div className={cn(
                        'flex flex-row justify-around',
                        'p-5 mt-4 lg:mt-6',
                        'border border-solid rounded-2xl border-gray-300'
                    )}>
                        <div className="flex flex-col justify-center items-center">
                            <div>2%</div>
                            <div>Market Fee</div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div>2%</div>
                            <div>WAX Fee</div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div>{collection['market_fee'] * 100}%</div>
                            <div>Collection Fee</div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <div>{cut} WAX</div>
                            <div>Your Cut</div>
                        </div>
                    </div> : <LoadingIndicator/>
                }
                <div className={cn(
                    'relative m-auto mt-5 lg:mt-8 h-20 lg:h-8',
                    'flex justify-evenly lg:justify-end'
                )}>
                    <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                    <WindowButton
                        text="Auction"
                        onClick={auction}
                        disabled={!sellPrice || ((!days || days === '0') && (!hours || hours === '0') && (!minutes || minutes === '0')) ? 'disabled' : ''}
                    />
                </div>
            </div>

            {isLoading ? <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction" />
            </div> : '' }
        </div>
    );
}

export default AuctionWindow;
