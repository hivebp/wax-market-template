import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import CollectionCard from "./CollectionCard";

import {getCollections} from "../api/Api";
import {Context} from "../marketwrapper";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

function CollectionList(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [ state, dispatch ] = useContext(Context);

    const [collections, setCollections] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const initialized = state.collections !== null && state.collections !== undefined;

    const receiveCollections = (res) => {
        setIsLoading(false);
        if (res && res.data)
            setCollections(res.data);
    }

    useEffect(() => {
        if (initialized) {
            getCollections(state.collections).then(res => receiveCollections(res));
        }
    }, [initialized]);

    return (
        <div className={cn(
            'lg:justify-evenly px-6',
            'min-h-60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
        )}>
            {
                isLoading ? <LoadingIndicator/> : collections.map((collection, index) => <CollectionCard key={collection.collection+'_'+index} collection={collection} ual={ual} />)
            }
        </div>
    );
}

export default CollectionList;
