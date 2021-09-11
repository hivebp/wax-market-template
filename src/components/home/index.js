import React from 'react';
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import HomeSlider from '../homeslider';
import cn from "classnames";

import config from "../../config.json";

const Home = () => {
    return (
        <Page>
            <Header
                title={config.market_title}
                description={config.market_description}
                image={config.market_image}
            />
            <HomeSlider />
            <div className={cn('container mx-auto my-20')}>
                <h4>Page Content goes here</h4>
            </div>
        </Page>
    );
};

export default Home;
