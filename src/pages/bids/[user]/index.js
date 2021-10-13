import React from 'react';

import qs from 'qs';
import Auctions from "../../../components/auctions";

const BidsPage = (props) => {
    return <Auctions {...props} />;
};

BidsPage.getInitialProps = async (ctx) => {
    const c = ctx.query.user;

    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[2].replace(c + '?', ''));

    values['bidder'] = c;

    return values;
};

export default BidsPage;
