import React, {useEffect, useState} from 'react';

import config from "../../config.json";

import Link from '../common/util/input/Link';
import PreviewImage from "./PreviewImage";
import cn from "classnames";

import {parseAssetsToMint} from "../helpers/Helpers";
import DropButtons from "../dropbuttons/DropButtons";

function DropPreview(props) {
    const drop = props['drop'];
    const [assets, setAssets] = useState([]);

    const index = props['index'];
    const templateData = props['templateData'];

    const { collectionName, collectionImage } = drop;

    useEffect(() => {
        parseAssetsToMint(drop.assetsToMint, templateData).then(res => setAssets(res));
    }, [drop]);

    return (
        <div 
            className={cn(
                'relative w-asset mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper rounded-br-2xl'
            )}
            id={'AssetCard_'+index}
        >
            <div className={cn(
                'flex flex-row justify-start items-center my-2 px-2',
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
            </div>

            <Link href={`/drop/${drop.dropId}`}>
                <div className="relative">
                    <div className={cn(
                        'aspect-w-1 aspect-h-1 overflow-hidden',
                    )}>
                        {assets && assets.map(asset =>
                            <div className="flex flex-1 h-full">
                                <PreviewImage {...props} asset={asset} />
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        'w-full flex justify-center items-center py-4 px-2 h-24',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible',
                    )}>
                        {drop.name ? drop.name : drop.dropId}
                    </div>
                </div>
            </Link>
            <DropButtons
                drop={drop}
                preview={true}
            />
        </div>
    );
}

export default DropPreview;
