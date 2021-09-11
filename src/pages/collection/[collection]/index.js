import React from 'react';

import CollectionComponent from "../../../components/collection/CollectionComponent";
import qs from 'qs';
import {getCollection} from "../../../components/api/Api";

const Collection = (props) => {
    return (<CollectionComponent {...props} />);
};

Collection.getInitialProps = async (ctx) => {
    const name = ctx.query.collection;
    const paths = ctx.asPath.split('/');

    const collection = await getCollection(name);

    const values = qs.parse(paths[2].replace(`${name}?`, ''));
    values['collection'] = collection && collection.data;

    return values;
};

export default Collection;
