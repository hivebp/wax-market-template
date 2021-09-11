import React, {useContext, useEffect, useState} from 'react';

import DropDetails from "./DropDetails";

import DropImage from "./DropImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import cn from 'classnames';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {Context} from "../marketwrapper";
import ReactMarkdown from 'react-markdown';
import DropButtons from "../dropbuttons/DropButtons";
import {getDrop} from "../api/Api";

const DropComponent = (props) => {
    const [drop, setDrop] = useState(props.drop);

    const [state, dispatch] = useContext(Context);

    const [isLoading, setIsLoading] = useState(false);
    const [bought, setBought] = useState(false);
    const [error, setError] = useState(null);

    const [templateData, setTemplateData] = useState(null);
    const [collectionData, setCollectionData] = useState(null);
    const collection = collectionData && collectionData.filter(
        collection => collection.collection_name === drop.collectionName)[0];

    const templates = templateData && templateData.filter(template => drop.assetsToMint.map(
        asset => asset.template_id && asset.template_id.toString()).includes(template.template_id.toString()));

    const title = `Check out ${drop.name}`;

    const description = drop.description;

    const initialized = state.collectionData !== null && state.collectionData !== undefined
        && state.templateData !== null && state.templateData !== undefined;

    useEffect(() => {
        if (initialized) {
            state.collectionData.then(res => res.success && res.data && setCollectionData(res.data.results));
            state.templateData.then(res => res.success && setTemplateData(res.data));
        }
    }, [initialized]);

    const handleBought = async (buyInfo) => {
        if (buyInfo) {
            if (buyInfo['bought']) {
                setIsLoading(true);
                await new Promise(r => setTimeout(r, 2000));
                getDrop(drop.dropId).then(res => setDrop(res));
            }

            if (buyInfo['error'])
                setError(buyInfo['error']);

            setBought(buyInfo['bought']);
        } else {
            setBought(false);
        }

        setIsLoading(false);
    };

    return (
        <Page id="AssetPage">
            <Header
                title={title}
                description={description}
            />
            <div className={cn('container mx-auto pt-10')}>
                <h4 className="inline-flex text-primary mb-4">
                    <div className='NextLink'>{drop.name}</div>
                </h4>
                {templates && collection ? templates.map(template =>
                    <div className="flex flex-col items-center md:justify-center md:flex-row h-auto px-10">
                        <div className="w-full md:w-2/5">
                            <DropImage
                                template={template}
                            />
                        </div>
                        <div className="w-full md:w-3/5 md:px-10">
                            <DropDetails
                                drop={drop}
                                template={template}
                                collection={collection}
                            />
                        </div>
                    </div>
                ) : <LoadingIndicator />}
            </div>
            <div className="font-normal text-lg leading-5 mt-4 mb-8 px-12">
                <ReactMarkdown>
                    {drop.description}
                </ReactMarkdown>
            </div>

            <div className="relative">
                <p className={cn(
                    'w-full pt-4 px-2 mb-5',
                    'text-center text-base font-light text-neutral',
                    'overflow-visible',
                )}>
                    Sold: {drop.currentClaimed}{drop.maxClaimable ? ` / ${drop.maxClaimable}` : ''}
                </p>
            </div>
            { bought ? <div>Purchase Complete</div> : <DropButtons
                drop={drop}
                bought={bought}
                error={error}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError}
                handleBought={handleBought}
            /> }
        </Page>
    );
};

export default DropComponent;
