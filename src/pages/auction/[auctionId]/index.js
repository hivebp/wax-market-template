import React from 'react';

import qs from 'qs';
import {getAuction} from "../../../components/api/Api";
import AuctionComponent from "../../../components/auction/AuctionComponent";

const AuctionPage = (props) => {
    return (<AuctionComponent {...props} />);
};

AuctionPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const auctionId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(
        0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const auction = await getAuction(auctionId);

    const values = qs.parse(paths[2].replace(`${auctionId}?`, ''));

    values['auction'] = auction && auction.data;

    return values;
};

export default AuctionPage;
