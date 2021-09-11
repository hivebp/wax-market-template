import config from "../../config.json";
import Head from 'next/head'
import React from "react";

const DefaultHeader = () => {
    return (
        <Head>
            <meta id="og-title" property="og:title" content={config.market_title} />
            <meta id="og-description" property="og:description" content={config.market_description} />
            <meta id="og-image" property="og:image" content={config.header_image} />
            <meta id="twitter-title" property="twitter:title" content={config.market_title} />
            <meta id="twitter-description" property="twitter:description" content={config.market_description} />
            <meta id="twitter-image" property="twitter:image" content={config.header_image} />
            <link id='page-image' rel="apple-touch-icon" href={config.header_image} />
        </Head>
    );
};

export default DefaultHeader;