import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import {Context} from "../marketwrapper";

import AssetCard from "../assetcard/AssetCard";
import {getAssets, getListings, getSales} from "../api/Api";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

const StaticAssetList = (props) => {
    const type = props.type;

    const collection = props.collection;

    const [ state, dispatch ] = useContext(Context);

    const [listings, setListings] = useState([]);

    const [sales, setSales] = useState([]);

    const [assets, setAssets] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const getListingsResult = (result) => {
        setListings(result);
        setIsLoading(false);
    }

    const getAssetsResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const getSalesResult = (result) => {
        setSales(result);
        setIsLoading(false);
    }

    const initialized = state.collections !== null && state.collections !== undefined;

    useEffect(() => {
        const initListings = async (page, collection) => {
            if (state.collections)
                getListings({
                    'collections': state.collections.filter(
                        item => (!collection || collection === '*') ? true : item === collection
                    ),
                    'page': page,
                    'limit': 5
                }).then(result => getListingsResult(result));
        };

        const initSales = async (page, collection) => {
            if (state.collections)
                getSales({
                    'collections':state.collections.filter(
                        item => (!collection || collection === '*') ? true : item === collection
                    ),
                    'orderDir': 'desc',
                    'sortBy': 'price',
                    'page': page,
                    'limit': 5
                }).then(result => getSalesResult(result));
        };

        const initAssets = async (page, collection) => {
            if (state.collections)
                getAssets({
                    'collections': state.collections.filter(
                        item => (!collection || collection === '*') ? true : item === collection
                    ),
                    'page': page,
                    'limit': 5
                }).then(result => getAssetsResult(result));
        };

        if (type === 'listings' && initialized)
            initListings(1, collection)
        if (type === 'assets' && initialized)
            initAssets(1, collection)
        if (type === 'sales' && initialized)
            initSales(1, collection)
    }, [type, collection, initialized]);

    return (
        <div>
            { isLoading ? <LoadingIndicator /> : <div className={cn(
                'relative mt-10 w-full px-0',
                'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4'
            )}>
            {
                listings && listings['success'] ? listings['data'].map((listing, index) =>
                    <AssetCard
                        {...props}
                        index={index}
                        listing={listing}
                        assets={listing.assets}
                        key={index}
                    />
                ) : ''
            }
            {
                assets && assets['success'] ? assets['data'].map((asset, index) =>
                    <AssetCard
                        {...props}
                        index={index}
                        assets={[asset]}
                        key={index}
                    />
                ) : ''
            }
                {
                    sales && sales['success'] ? sales['data'].map((sale, index) =>
                        <AssetCard
                            {...props}
                            index={index}
                            sale={sale}
                            assets={sale.assets}
                            key={index}
                        />
                    ) : ''
                }
            </div> }
        </div>
    );
};

export default StaticAssetList;
