import React from 'react';

import ListingComponent from "../../../components/listing/ListingComponent";
import qs from 'qs';
import {getSale} from "../../../components/api/Api";

const Sale = (props) => {
    return (<ListingComponent {...props} />);
};

Sale.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const listingId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(
        0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const listing = await getSale(listingId);

    const values = qs.parse(paths[2].replace(`${listingId}?`, ''));

    values['listing'] = listing && listing.data;

    return values;
};

export default Sale;
