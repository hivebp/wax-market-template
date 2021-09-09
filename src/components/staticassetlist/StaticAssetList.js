import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import {Context} from "../marketwrapper";

import AssetPreview from "../assetpreview/AssetPreview";
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

    useEffect(() => {
        const initListings = async (page, collection) => {
            setIsLoading(true);
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
            setIsLoading(true);
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
            setIsLoading(true);
            if (state.collections)
                getAssets({
                    'collections': state.collections.filter(
                        item => (!collection || collection === '*') ? true : item === collection
                    ),
                    'page': page,
                    'limit': 5
                }).then(result => getAssetsResult(result));
        };

        if (type === 'listings')
            initListings(1, collection)
        if (type === 'assets')
            initAssets(1, collection)
        if (type === 'sales')
            initSales(1, collection)
    }, [type, collection]);

    return (
        <div>
            { isLoading ? <LoadingIndicator /> : <div className={cn(
                'relative mt-10 w-full px-0',
                'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4'
            )}>
            {
                listings && listings['success'] ? listings['data'].map((listing, index) =>
                    <AssetPreview
                        {...props}
                        index={index}
                        listing={listing}
                        assets={listing.assets}
                    />
                ) : ''
            }
            {
                assets && assets['success'] ? assets['data'].map((asset, index) =>
                    <AssetPreview
                        {...props}
                        index={index}
                        assets={[asset]}
                    />
                ) : ''
            }
                {
                    sales && sales['success'] ? sales['data'].map((sale, index) =>
                        <AssetPreview
                            {...props}
                            index={index}
                            sale={sale}
                            assets={sale.assets}
                        />
                    ) : ''
                }
            </div> }
        </div>
    );
};

export default StaticAssetList;
