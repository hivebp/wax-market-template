import React, {useState} from 'react';


import CollectionDetails from "./CollectionDetails";

import Link from '../common/util/input/Link';
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from '../../config.json';
import StaticAssetList from "../staticassetlist/StaticAssetList";
import ScrollUpIcon from '../common/util/ScrollUpIcon';
import cn from "classnames";

const CollectionComponent = (props) => {
    const collection = props.collection;

    const [showImage, setShowImage] = useState(false);

    const {name, collection_name, img, description} = collection;

    console.log(collection_name);

    const image = config.ipfs + img;

    const title = `Check out ${name}`;

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const toggleImage = () => {
        setShowImage(!showImage);
    };

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementById("CollectionPage");
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };

    const handleScroll = e => {
        let element = e.target;

        if (element.id === 'CollectionPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
        }
    };

    const AssetListHeader = ({header}) => {
        return (
            <h3 className="flex mt-20 mb-4 text-3xl text-left text-neutral">
                {header}
            </h3>
        );
    }

    return (
        <Page onScroll={e => handleScroll(e)} id="CollectionPage">
            <Header
                ogTitle={title}
                ogDescription={description}
                ogImage={image}
                pageImage={image}
                twitterTitle={title}
                twitterDescription={description}
                twitterImage={image}
            />

            <div className={cn('container mx-auto')}>

                {showImage ? <div className="fixed h-full w-full m-auto top-0 left-0 z-100 shadow-lg backdrop-filter backdrop-blur-lg" onClick={toggleImage}>
                    <img className="max-w-full max-h-full m-auto" src={image} alt="none" />
                </div> : ''}

                <div className="items-center mt-10 grid grid-cols-8 gap-8">
                    <div className="col-span-8 md:col-span-2 md:col-start-2 relative flex justify-center text-center">
                        <img className="w-full max-w-full mt-auto" src={image} alt="none" onClick={toggleImage} />
                    </div>
                    <div className="col-span-8 md:col-span-4">
                        <CollectionDetails collection={collection} />
                    </div>
                </div>

                <Link href={`/explorer?tab=assets&collection=${collection_name}`}>
                    <AssetListHeader header="Newest Assets" />
                </Link>
                <StaticAssetList type={'assets'} {...props} collection={collection_name} />

                <Link href={`/market?collection=${collection_name}&sort=date_desc`}>
                    <AssetListHeader header="Latest Listings" />
                </Link>
                <StaticAssetList type={'listings'} {...props} collection={collection_name} />

                <AssetListHeader header="Top Sales" />
                <StaticAssetList type={'sales'} {...props} collection={collection_name} />
            </div>

            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : '' }
        </Page>
    );
};

export default CollectionComponent;
