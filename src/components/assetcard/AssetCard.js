import React, {useEffect, useState} from 'react';

import config from "../../config.json";

import MarketButtons from '../marketbuttons';

import moment from 'moment';

import {
    formatMintInfo
} from "../helpers/Helpers";
import CardDetails from "./CardDetails";
import Link from '../common/util/input/Link';
import SvgIcon from '../common/util/SvgIcon'
import MoreOptions from "./MoreOptions";
import CardImage from "./CardImage";
import {getListingsById, getAsset, getAuctionsById} from "../api/Api";
import cn from "classnames";

import {
  ArrowLeft,
  ArrowRight
} from '@material-ui/icons'

function AssetCard(props) {
    const [listing, setListing] = useState(props['listing']);

    const [assets, setAssets] = useState(props['assets']);

    const [selectedAsset, setSelectedAsset] = useState(0);

    const asset = assets[selectedAsset];

    const index = props['index'];

    const [update, setUpdate] = useState({});
    const [frontVisible, setFrontVisible] = useState(true);
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState(null);
    const [bought, setBought] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [bidPlaced, setBidPlaced] = useState(false);
    const [listed, setListed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transferred, setTransferred] = useState(false);
    const [auctionInterval, setAuctionInterval] = useState(null);
    const [auctionTimeLeft, setAuctionTimeLeft] = useState('');
    const sale = props['sale'];
    const page = props['page'];

    const {
        collection, asset_id, template_mint, name
    } = asset;
    
    const {
        collection_name
    } = collection;

    const auction_id = listing ? listing['auction_id'] : null;
    const end_time = listing ? listing['end_time'] : null;

    const sale_id = listing ? listing['sale_id'] : (
        asset.sales && asset.sales.length > 0 ? asset.sales[0]['sale_id'] : null);

    useEffect(() => {
    }, [frontVisible, sale_id]);

    useEffect(() => {
        if (auction_id) {
            if (auctionInterval) {
                clearInterval(auctionInterval);
            }

            const currentTime = moment();

            const diffTime = (end_time / 1000) - currentTime.unix();
            let duration = moment.duration(diffTime * 1000, 'milliseconds');
            const interval = 1000;

            setAuctionInterval(setInterval(function() {
                duration = moment.duration(duration - interval, 'milliseconds');

                if (auctionInterval) {
                    clearInterval(auctionInterval);
                }

                if (duration.asSeconds() < 0)
                    setAuctionTimeLeft(' - ');
                else
                    setAuctionTimeLeft(`${duration.days()}d ${duration.hours()}h ${
                        duration.minutes()}m ${duration.seconds()}s`);
            }, interval));
        }
    }, [auction_id]);

    const handleBought = (buyInfo) => {
        if (buyInfo) {
            if (buyInfo['bought'])
                setUpdate({
                    'new_owner': userName
                });

            if (buyInfo['error'])
                setError(buyInfo['error']);

            setBought(buyInfo['bought']);
        } else {
            setBought(false);
        }

        setIsLoading(false);
    };

    const handleBidPlaced = async (bidInfo) => {
        if (bidInfo) {
            if (bidInfo['error'])
                setError(bidInfo['error']);

            if (bidInfo['bidPlaced']) {
                setIsLoading(true);
                await new Promise(r => setTimeout(r, 2000));
                getAuctionsById(asset.asset_id).then(res => updateListing(res));
            }

            setBidPlaced(bidInfo['bidPlaced']);
        } else {
            setBidPlaced(false);
        }
    };

    const updateListing = (res) => {
        if (res) {
            setListing(res.data[0]);
            setIsLoading(false);
        }
    };

    const handleList = async (sellInfo) => {
        if (sellInfo) {
            const wasListed = sellInfo['listed'];
            const error = sellInfo['error'];

            if (error)
                setError(error);

            if (wasListed) {
                await new Promise(r => setTimeout(r, 2000));
                getListingsById(asset.asset_id).then(res => updateListing(res));
            }

            setListed(wasListed);
        }
        setIsLoading(false);
    };

    const handleCancel = (cancel) => {
        try {
            if (cancel) {
                setCanceled(cancel);
                setListing(null);
            }

            setIsLoading(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading(false);
            setError(e.message);
        }
    };

    const handleTransfer = async (info) => {
        if (info) {
            const wasTransferred = info['transferred'];
            const error = info['error'];

            if (error)
                setError(error);

            if (wasTransferred) {
                await new Promise(r => setTimeout(r, 2000));
                getAsset(asset.asset_id).then(res => res && setAssets([res.data]));
            }

            setTransferred(wasTransferred);
        }
        setIsLoading(false);
    };

    const handleAuction = async (info) => {
        if (info) {
            const wasAuctioned = info['auctioned'];
            const error = info['error'];

            if (error)
                setError(error);

            if (wasAuctioned) {
                await new Promise(r => setTimeout(r, 2000));
                getAsset(asset.asset_id).then(res => res && setAssets([res.data]));
            }

            setListed(wasAuctioned);
        }
        setIsLoading(false);
    };

    let mintInfo = formatMintInfo(template_mint);

    const toggleShowMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleFront = () => {
        setFrontVisible(!frontVisible);
    };

    const nextAsset = () => {
        let index = selectedAsset + 1;
        if (index === assets.length)
            index = 0;
        setSelectedAsset(index);
    }

    const prevAsset = () => {
        let index = selectedAsset - 1;
        if (index === -1)
            index = assets.length - 1;
        setSelectedAsset(index);
    }

    return (
        <div 
            className={cn(
                'relative w-asset mx-auto overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper',
            )}
            id={'AssetCard_'+index}
        >
            <div className={cn(
                'flex justify-between my-2 px-2',
            )}>                
                <Link href={'/collection/' + collection_name}>
                    <div className={cn(
                        'relative flex items-center leading-4',
                        'text-white leading-relaxed text-sm',
                        'cursor-pointer'
                    )}>
                        { collection['img'] ? <div className="h-4 rounded-lg overflow-hidden">
                            <img src={config.ipfs + collection['img']} className="collection-img" alt="none"/>
                        </div> : '' }
                        <div className="font-light ml-2 mr-auto opacity-80 hover:opacity-100 truncate">{collection_name}</div>
                    </div>
                </Link>
                <div
                    onClick={toggleShowMenu}
                    className={cn(
                        'w-5 h-5 z-30',
                        'text-white leading-snug cursor-pointer',
                        'opacity-70 hover:opacity-100',
                    )} 
                >
                    <img
                        className={cn(
                            'transition transform duration-250',
                            {'rotate-90': showMenu},
                            {'rotate-0': !showMenu}
                        )}
                        src="/more.svg"
                        alt="moreSvg"
                    />
                </div>
            </div>
            <MoreOptions
                setShowMenu={setShowMenu}
                ual={props['ual']}
                showMenu={showMenu}
                asset={asset}
                handleTransfer={handleTransfer}
                handleAuction={handleAuction}
                listed={listed}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                transferred={transferred}
            />
            <CardDetails
                visible={!frontVisible}
                asset={asset}
                update={update}
            />
            {assets.length > 1 && <div className={cn(
                'absolute left-1 w-16 h-8 bottom-16 bg-transparent',
                'cursor-pointer outline-none opacity-80',
                'hover:opacity-100 z-10')}>
                {`Bundle ${selectedAsset + 1}/${assets.length}`}
            </div>}
            <div className={cn(
                'aspect-w-1 aspect-h-1 overflow-hidden',
                {'cursor-pointer' : frontVisible},
                {'cursor-pointer hidden' : !frontVisible},
            )}>
                {assets.length > 1 && <div
                    className={cn(
                        'absolute left-0 w-8 h-8 mr-auto bg-transparent',
                        'cursor-pointer outline-none opacity-80',
                        'hover:opacity-100',
                        'back-button z-10',
                    )}
                    onClick={prevAsset}
                >
                    <img src={'/arrow-ios-back-outline.svg'} alt="<" />
                </div>}
                <Link href={sale_id ? `/listing/${sale_id}` : auction_id ? `/auction/${auction_id}` : `/asset/${asset_id}`}>
                    <div className="flex flex-1 justify-center h-full">
                        <CardImage {...props} asset={asset} />
                    </div>
                </Link>
                {assets.length > 1 && <div
                    className={cn(
                        'absolute w-8 h-8 ml-auto bg-transparent',
                        'cursor-pointer outline-none opacity-80',
                        'hover:opacity-100',
                        'forward-button z-10',
                    )}
                    onClick={nextAsset}
                >
                    <img src={'/arrow-ios-forward-outline.svg'} alt=">" />
                </div>}
            </div>

            <Link href={sale_id ? `/listing/${sale_id}` : auction_id ? `/auction/${auction_id}` : `/asset/${asset_id}`}>
                <div className="relative">
                    <p className={cn(
                        'w-full pt-4 px-2 mb-5',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible',
                    )}>
                        {name ? name : asset_id}
                    </p>
                    {frontVisible ?
                    <div className="absolute -top-3 left-22">
                        {mintInfo}
                    </div> : '' }
                </div>
            </Link>

            { frontVisible ? <MarketButtons
                ual={props['ual']}
                asset={asset}
                listing={listing}
                bidPlaced={bidPlaced}
                sale={sale}
                update={update}
                handleList={handleList}
                handleBought={handleBought}
                handleCancel={handleCancel}
                handleBidPlaced={handleBidPlaced}
                bought={bought}
                canceled={canceled}
                error={error}
                setError={setError}
                listed={listed}
                setListed={setListed}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                page={page}
            /> : '' }

            <div
                className={cn(
                    'absolute w-8 h-8 bottom-0 bg-transparent',
                    'cursor-pointer outline-none opacity-80',
                    'hover:opacity-100',
                    {'right-0': frontVisible},
                    {'left-0': !frontVisible},
                )}
                onClick={toggleFront}
            >
                { frontVisible?
                    <SvgIcon icon={<ArrowLeft fontSize="large" />} />
                    :
                    <SvgIcon icon={<ArrowRight fontSize="large" />} />
                }                
            </div>
            {auctionTimeLeft && !canceled && <div
                className={cn('text-center')}
            >
                {auctionTimeLeft}
            </div> }
        </div>
    );
}

export default AssetCard;
