import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import {getAssets} from "../api/Api";
import {Context} from "../marketwrapper";
import SelectableAssetPreview from "./SelectableAssetPreview";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

function MyAssetList(props) {
    const templates = props['templates'];
    const [ state, dispatch ] = useContext(Context);

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const templatesNeeded = props['templatesNeeded'];

    const parseAssetResult = (result) => {
        const assets = [];

        result.map(res => {
            if (res && res.success) {
                res.data.map(asset => {
                    assets.push(asset);
                })
            }
        });

        setIsLoading(false);

        setAssets(assets);
    };

    useEffect(() => {
    }, [assets.length]);

    useEffect(() => {
        if (userName) {
            Promise.all(
                templates.map(template => getAssets({
                    template_id: template.template_id,
                    collections: [template.collection.collection_name],
                    user: userName,
                    limit: 10,
                    sortBy: 'template_mint',
                    orderDir: 'desc',
                }))
            ).then(res => parseAssetResult(res));
        }
    }, [userName]);

    return (
        <div className={cn(
            'w-full grid grid-cols-4 md:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-10',
        )}>
            {isLoading ? <LoadingIndicator />
                : assets.map(asset =>
                <SelectableAssetPreview
                    asset={asset}
                    templatesNeeded={templatesNeeded}
                />
            )}
        </div>
    );
}

export default MyAssetList;