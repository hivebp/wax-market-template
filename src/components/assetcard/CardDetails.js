import React, {useEffect, useState} from 'react';
import {GetPrices} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";

function CardDetails(props) {
    const asset = props['asset'];
    const update = props['update'];
    const new_owner = update && update['new_owner'];
    const index = props['index'];

    const visible = props['visible'];

    const [priceInfo, setPriceInfo] = useState({});

    let {
        asset_id, collection, owner, template, schema
    } = asset;

    const { schema_name } = schema;

    const loadPriceInfo = async (res, asset_id) => {
        if (res && res.success) {
            priceInfo[asset_id] = res.data[0];
            setPriceInfo(priceInfo);
        }
    }

    const median = priceInfo[asset_id] ? priceInfo[asset_id]['suggested_median'] : null;
    const min = priceInfo[asset_id] ? priceInfo[asset_id]['min'] : null;
    const max = priceInfo[asset_id] ? priceInfo[asset_id]['max'] : null;
    const token_precision = priceInfo[asset_id] ? priceInfo[asset_id]['token_precision'] : null;

    useEffect(() => {
        if (visible && !priceInfo[asset_id])
            GetPrices(asset_id).then(res => loadPriceInfo(res, asset_id));
    }, [new_owner, visible, asset_id, index]);

    return (
        <div className={visible ? "relative w-full mb-auto px-4 pt-4 overflow-y-auto" : "hidden"}>
            <h4 className="text-neutral font-normal mb-0 text-md uppercase">Details</h4>
            <table className="w-full mt-4 font-normal">
                <tbody>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Asset ID:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{asset_id}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Collection:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{collection['name']}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Schema:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{schema_name}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Owner:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{owner}</td>
                </tr>
                { template && template.issued_supply &&
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Issued Supply:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{template.issued_supply}</td>
                </tr>
                }
                { median && <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Suggested Median:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{formatNumber(median / (Math.pow(10, token_precision)))} WAX</td>
                </tr> }
                { min && <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Min Sold:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{formatNumber(min / (Math.pow(10, token_precision)))} WAX</td>
                </tr> }
                { max && <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Max Sold:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{formatNumber(max / (Math.pow(10, token_precision)))} WAX</td>
                </tr> }
                </tbody>
            </table>
        </div>
    );
}

export default CardDetails;
