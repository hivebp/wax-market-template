import React, {useEffect, useState} from 'react';

import config from "../../config.json";

import moment from 'moment';
import Link from 'next/link';
import PreviewImage from "./PreviewImage";
import cn from "classnames";

import {parseAssetsToMint} from "../helpers/Helpers";

function DropPreview(props) {
    const drop = props['drop'];
    const [assets, setAssets] = useState([]);
    const [dropInterval, setDropInterval] = useState(null);
    const [dropTimeLeft, setDropTimeLeft] = useState('');
    const [dropReady, setDropReady] = useState(false);
    const [dropEnded, setDropEnded] = useState(false);

    const index = props['index'];
    const templateData = props['templateData'];

    const { collectionName, collectionImage } = drop;

    useEffect(() => {
        parseAssetsToMint(drop.assetsToMint, templateData).then(res => setAssets(res));
    }, [drop]);

    useEffect(() => {
        const currentTime = moment();

        if (currentTime.unix() > drop.endTime) {
            setDropEnded(true);
        }

        const diffTime = drop.startTime - currentTime.unix();

        if (diffTime > 0) {
            if (dropInterval) {
                clearInterval(dropInterval);
            }

            let duration = moment.duration(diffTime * 1000, 'milliseconds');
            const interval = 1000;

            setDropInterval(setInterval(function() {
                duration = moment.duration(duration - interval, 'milliseconds');

                if (dropInterval) {
                    clearInterval(dropInterval);
                }

                if (duration.asSeconds() < 0)
                    setDropTimeLeft(null);
                else
                    setDropTimeLeft(`${duration.days()}d ${duration.hours()}h ${
                        duration.minutes()}m ${duration.seconds()}s`);
            }, interval));
        } else {
            setDropReady(true);
        }
    }, [dropReady === false]);

    return (
        <div 
            className={cn(
                'relative w-asset mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper rounded-br-2xl'
            )}
            id={'AssetPreview_'+index}
        >
            <div className={cn(
                'flex justify-between my-2 px-2',
            )}>                
                <Link href={'/collection/' + collectionName}>
                    <div className={cn(
                        'relative flex items-center leading-4',
                        'text-white leading-relaxed text-sm',
                        'cursor-pointer'
                    )}>
                        { collectionImage ? <div className="h-4 rounded-lg overflow-hidden">
                            <img src={config.ipfs + collectionImage} className="collection-img" alt="none"/>
                        </div> : '' }
                        <div className="font-light ml-2 mr-auto opacity-60 truncate">{collectionName}</div>
                    </div>
                </Link>
                {assets && assets.map(asset =>
                    <div className="flex flex-1 h-full">
                        <PreviewImage {...props} asset={asset} />
                    </div>
                )}
            </div>

            <Link href={`/drop/${drop.dropId}`}>
                <div className="relative">
                    <p className={cn(
                        'w-full pt-4 px-2 mb-5',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible',
                    )}>
                        {drop.name ? drop.name : drop.dropId}
                    </p>
                </div>
            </Link>
            <div className="relative">
                <p className={cn(
                    'w-full pt-4 px-2 mb-5',
                    'text-center text-base font-light text-neutral',
                    'overflow-visible',
                )}>
                    {!drop.listingPrice || drop.listingPrice === '0 NULL' ? 'Free' : drop.listingPrice}
                </p>
            </div>
            {dropTimeLeft && !dropReady && <div
                className={cn('text-center')}
            >
                Starts In: {dropTimeLeft}
            </div> }
            {dropReady && !dropEnded && <div
                className={cn('text-center cursor-pointer')}
            >
                <Link href={`/drop/${drop.dropId}`}><div>Drop Live</div></Link>
            </div> }
            {dropEnded && <div
                className={cn('text-center')}
            >
                <div>Drop Ended</div>
            </div> }
        </div>
    );
}

export default DropPreview;
