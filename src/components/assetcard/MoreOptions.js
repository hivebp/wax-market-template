import ShareButton from "../sharebutton/ShareButton";
import React, {useContext} from "react";
import {Context} from "../marketwrapper";
import cn from "classnames";

import config from "../../config.json";

function MoreOptions(props) {
    const showMenu = props['showMenu'];
    const setShowMenu = props['setShowMenu'];
    const asset = props['asset'];
    const listing = props['listing'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const [ state, dispatch ] = useContext(Context);

    const handleTransfer = props['handleTransfer'];
    const handleAuction = props['handleAuction'];
    const transferred = props['transferred'];
    const listed = props['listed'];
    const setIsLoading = props['setIsLoading'];

    const {sale_id, asset_id} = asset;

    const transfer = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (info) => handleTransfer(info) });
        dispatch({ type: 'SET_ACTION', payload: 'transfer' });
        dispatch({ type: 'SET_TRIGGERED', payload: true });
    };

    const auction = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleAuction(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'auction' });
        dispatch({ type: 'SET_TRIGGERED', payload: true });
    };

    const forSale = asset.sales && asset.sales.length > 0;

    const transferrable = !listed && !forSale && !transferred && asset['owner'] === userName && asset_id;
    const auctionable = !listing && !forSale && asset['owner'] === userName && !listed && asset_id;

    return (
        <div
            className={cn(
                'absolute right-0 top-0 w-28 h-auto',
                'px-2 py-4 flex-wrap rounded-lg z-20',
                'bg-gray-700',
                'transition-opacity duration-200',
                {'z-20 opacity-100' : showMenu},
                {'-z-10 opacity-0 hidden' : !showMenu}
            )}
            onMouseLeave={() => setShowMenu(false)}
        >
            <ShareButton type={'asset'} link={config.market_url + (sale_id ? `/sale/${sale_id}` : `/asset/${asset_id}`)} />
            {
                transferrable ?
                    <div
                        className={cn(
                            'flex w-24 h-4 py-2.5 m-auto justify-start items-center',
                            'text-xs text-white font-bold cursor-pointer',
                            'rounded outline-none',
                            'transition-width duration-250',
                            'hover:uppercase',
                        )}
                        onClick={transfer}
                    >
                        <div className="text-center">
                            <img src="/diagonal-arrow-right-up-outline.svg" alt="Transfer" className="w-4 h-4 mr-4" />
                        </div>
                        <div>Transfer</div>
                    </div> : ''
            }
            {
                auctionable ?
                    <div
                        className={cn(
                            'flex w-24 h-4 py-2.5 m-auto justify-start items-center',
                            'text-xs text-white font-bold cursor-pointer',
                            'rounded outline-none',
                            'transition-width duration-250',
                            'hover:uppercase',
                        )}
                        onClick={auction}
                    >
                        <div className="text-center">
                            <img src="/pricetags-outline.svg" alt="Transfer" className="w-4 h-4 mr-4" />
                        </div>
                        <div>Auction</div>
                    </div> : ''
            }
        </div>
    );
}

export default MoreOptions;
