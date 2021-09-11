import React from 'react';

import DropComponent from "../../../components/drop/DropComponent";
import qs from 'qs';
import {getDrop} from "../../../components/api/Api";

const DropPage = (props) => {
    return (<DropComponent {...props} />);
};

DropPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');
    const dropId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(
        0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const drop = await getDrop(dropId);

    const values = qs.parse(paths[2].replace(`${dropId}?`, ''));
    values['drop'] = drop;

    return values;
};

export default DropPage;
