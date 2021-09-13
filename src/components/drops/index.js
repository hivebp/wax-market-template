import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import config from "../../config.json";

import {getDrops} from "../api/Api";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import MarketContent from "../common/layout/Content"
import Page from "../common/layout/Page"
import Header from "../common/util/Header"
import {getValues, getFilters} from "../helpers/Helpers";
import ScrollUpIcon from '../common/util/ScrollUpIcon';
import cn from "classnames"
import DropPreview from "../droppreview/DropPreview";

const Drops = (props) => {
    const [ state, dispatch ] = useContext(Context);

    const [drops, setDrops] = useState([]);
    const [collectionData, setCollectionData] = useState(null);
    const [templateData, setTemplateData] = useState(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const initialized = state.collections !== null && state.collections !== undefined && state.collectionData !== null && state.collectionData !== undefined && state.templateData !== null && state.templateData !== undefined;

    const values = getValues();

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const getResult = (result) => {
        setDrops(result);
        setIsLoading(false);
    }

    const initDrops = async (page, ) => {
        setIsLoading(true);
        getDrops(getFilters(values, state.collections, page), collectionData, templateData).then(
            result => getResult(result));
    };

    useEffect(() => {
        if (initialized && !collectionData && !templateData) {
            state.collectionData.then(res => setCollectionData(res));
            state.templateData.then(res => setTemplateData(res));
        }
        if (initialized && collectionData && templateData) {
            initDrops(page, collectionData && collectionData.success && collectionData.data && collectionData.data.results ?
                collectionData.data.results[0] : null);
        }
    }, [page, initialized, collectionData, templateData]);

    const handleScroll = e => {
        let element = e.target;

        if (element.id === 'MarketPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: true });
            }
        }
    };

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementById("MarketPage");
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };

    return (
        <Page onScroll={e => handleScroll(e)} id="MarketPage">
            <Header
                title={config.market_title}
                description={config.market_description}
                image={config.market_image}
            />
            <MarketContent>
                <div 
                    className={cn(
                        'w-full sm:1/3 md:w-1/4 md:ml-4 mx-auto p-0 md:p-5',
                        'max-w-filter'
                    )}    
                >
                        
                    <Filters
                        {...props}
                        searchPage={'market'}
                    />
                </div>
                <div
                    className={cn(
                        'w-full sm:2/3 md:w-3/4',
                    )}
                >
                    <Pagination
                        items={drops}
                        page={page}
                        setPage={setPage}
                    />
                    { isLoading ? <LoadingIndicator /> : 
                        <div className={cn(
                            "relative w-full mb-24",
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        )}>
                            {
                                drops ? drops.map((drop, index) =>
                                    <DropPreview
                                        {...props}
                                        templateData={templateData}
                                        key={index}
                                        index={index}
                                        drop={drop}
                                    />
                                ) : ''
                            }
                        </div>
                    }
                    {isLoading ? '' :
                        <Pagination
                            items={drops}
                            page={page}
                            setPage={setPage}
                        />
                    }
                </div>
            </MarketContent>
            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : '' }
        </Page>
    );
};

export default Drops;
