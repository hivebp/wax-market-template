import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import MarketContent from "../common/layout/Content";
import Pagination from "../pagination/Pagination";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import AssetCard from "../assetcard/AssetCard";
import {Context} from "../marketwrapper";
import {getValues} from "../helpers/Helpers";
import config from "../../config.json";
import {post} from "superagent/lib/client";
import {getAssets} from "../api/Api";

export default function UnclaimedPacksList(props) {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const user = props['user'];

    const values = getValues();
    values['user'] = user;

    const initialized = state.collections !== null && state.collections !== undefined;

    const unboxed = state.unboxed;

    const getAssetsResult = (result, unboxer) => {
        const assets = [];
        if (result && result.success) {
            result.data.map(asset => {
                asset['unboxer'] = unboxer;
                assets.push(asset);
            })
        }

        setAssets(assets);
        setIsLoading(false);
    }

    const getUnclaimedPacksResult = (results) => {
        const asset_ids = [];

        let unboxer = null;

        results.map(res => {
            if (res && res.status === 200 && res.body && res.body.rows) {
                res.body.rows.map(row => {
                    if (!unboxer) {
                        unboxer = row.unboxer;
                    }
                    asset_ids.push(row.pack_asset_id)
                });
            }
        });

        if (asset_ids.length > 0)
            getAssets({ids: asset_ids, limit: config.limit}).then(res => getAssetsResult(res, unboxer));
        else {
            setAssets([]);
            setIsLoading(false);
        }
    }

    const getUnclaimedPacks = async () => {
        const promises = [];
        config.packs_contracts.map((contract) => {
            if (contract === 'atomicpacksx') {
                const body = {
                    "json": true,
                    "code": contract,
                    "scope": contract,
                    "table": "unboxpacks",
                    "table_key": "unboxer",
                    "lower_bound": user,
                    "upper_bound": user,
                    "index_position": 2,
                    "key_type": "name",
                    "limit": 200,
                    "reverse": false,
                    "show_payer": false
                }

                const url = config.api_endpoint + '/v1/chain/get_table_rows';
                promises.push(post(url, body));
            }
        })

        if (promises.length > 0) {
            Promise.all(promises).then(res => getUnclaimedPacksResult(res));
        }
    }

    const initPacks = (page) => {
        setIsLoading(true);
        getUnclaimedPacks();
    };

    useEffect(() => {
        if (initialized || unboxed) {
            initPacks(page)
            if (unboxed)
                dispatch({ type: 'SET_UNBOXED', payload: false });
        }
    }, [page, initialized, unboxed]);

    return (
        <MarketContent>
            <div className={cn('w-full grid grid-cols-8 gap-10')}>
                <div
                    className={cn(
                        'col-span-8 sm:col-span-8',
                    )}
                >
                    <Pagination
                        items={assets && assets.data}
                        page={page}
                        setPage={setPage}
                    />
                    { isLoading ? <LoadingIndicator /> :
                        <div className={cn(
                            "relative w-full mb-24",
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        )}>
                            {
                                assets && assets.map((asset, index) =>
                                    <AssetCard
                                        {...props}
                                        key={index}
                                        index={index}
                                        assets={[asset]}
                                        page={'unclaimed_packs'}
                                    />
                                )
                            }
                        </div>
                    }
                    {isLoading ? '' :
                        <Pagination
                            items={assets && assets.data}
                            page={page}
                            setPage={setPage}
                        />
                    }
                </div>
            </div>
        </MarketContent>
    );
}