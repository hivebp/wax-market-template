import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import {Context} from "../marketwrapper";
import {getFilters, getValues} from "../helpers/Helpers";
import {getAssets} from "../api/Api";
import Pagination from "../pagination/Pagination";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import AssetCard from "../assetcard/AssetCard";

function MyPacksList(props) {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const values = getValues();
    values['user'] = props['user'];

    console.log(values['user']);

    const initialized = state.collections !== null && state.collections !== undefined;

    const unboxed = state.unboxed;

    const getAssetsResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initPacks = (page) => {
        setIsLoading(true);
        getAssets(getFilters(values, state.collections, 'packs', page)).then(
            result => getAssetsResult(result));

    };

    useEffect(() => {
        if (initialized || unboxed) {
            initPacks(page)
            if (unboxed)
                dispatch({ type: 'SET_UNBOXED', payload: false });
        }
    }, [page, initialized, unboxed]);

    return (
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
                            assets && assets['success'] ? assets['data'].map((asset, index) =>
                                <AssetCard
                                    {...props}
                                    key={index}
                                    index={index}
                                    assets={[asset]}
                                    page={'packs'}
                                />
                            ) : ''
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
    );
}

export default MyPacksList;