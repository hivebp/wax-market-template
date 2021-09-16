import React from "react";
import moment from 'moment';
import config from '../../config.json';
import Link from '../common/util/input/Link';

const AssetDetails = (props) => {
    const asset = props.asset;

    const {name, asset_id, owner, schema, minted_at_time, template_mint} = asset;

    const utc = moment.unix(minted_at_time / 1000).utc().toDate();
    const date = minted_at_time ? moment(utc).local().format('YYYY-MM-DD HH:mm:ss') : '';

    return (
        <div className="text-sm text-white overflow-auto">
            <h4 className="inline-flex text-primary mb-4">
                { asset.collection['img'] ? <div className="h-4 mr-3 rounded-lg overflow-hidden">
                    <img src={config.ipfs + asset.collection['img']} className="collection-img" alt="none" />
                </div> : '' }
                <Link href={`/collection/${asset.collection.collection_name}`}>
                    <div className='NextLink'>{asset.collection.collection_name}</div>
                </Link>
            </h4>
            <h2 className="text-left text-white text-3xl font-bold mb-4">
                {name} <span className="font-normal italic">#{template_mint}</span>
            </h2>

            <div className="font-normal text-lg leading-5 mb-8">
                <span className="opacity-70">Owned by</span> {owner}
            </div>

            <table className="w-full my-auto text-lg font-normal">
                <tr>
                    <td className="text-left w-1/3">ID:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{asset_id}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Issued Supply:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">
                        <div className="inline-flex leading-6">
                            {asset.template.issued_supply}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Schema:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{schema.schema_name}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Minted at:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{date}</td>
                </tr>
            </table>
        </div>
    );
};

export default AssetDetails;
