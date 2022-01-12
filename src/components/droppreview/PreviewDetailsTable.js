import React, { useEffect, useState } from 'react'
import { GetPrices } from '../api/Api'
import { formatNumber } from '../helpers/Helpers'

function PreviewDetailsTable(props) {
    const asset = props['asset']
    const update = props['update']

    const visible = props['visible']

    const [priceInfo, setPriceInfo] = useState(null)

    let { asset_id, collection, owner, template, schema } = asset

    const { schema_name } = schema

    const loadPriceInfo = async (res) => {
        if (res && res.success) {
            setPriceInfo(res.data[0])
        }
    }

    const median = priceInfo ? priceInfo['suggested_median'] : null
    const min = priceInfo ? priceInfo['min'] : null
    const max = priceInfo ? priceInfo['max'] : null
    const token_precision = priceInfo ? priceInfo['token_precision'] : null

    useEffect(() => {
        if (visible && !priceInfo) GetPrices(asset_id).then((res) => loadPriceInfo(res))
    }, [update['new_owner'], visible])

    return (
        <div className={visible ? 'relative w-full mb-auto px-4 pt-4 overflow-y-auto' : 'hidden'}>
            <h4 className="text-neutral font-normal mb-0 text-md uppercase">Details</h4>
            <table className="w-full mt-4 font-normal">
                <tbody>
                    <tr>
                        <td className="text-white w-24 text-left text-xs">
                            <b>Asset ID:</b>
                        </td>
                        <td className="text-white max-w-td text-right text-xs leading-4">{asset_id}</td>
                    </tr>
                    <tr>
                        <td className="text-white w-24 text-left text-xs">
                            <b>Collection:</b>
                        </td>
                        <td className="text-white max-w-td text-right text-xs leading-4">{collection['name']}</td>
                    </tr>
                    <tr>
                        <td className="text-white w-24 text-left text-xs">
                            <b>Schema:</b>
                        </td>
                        <td className="text-white max-w-td text-right text-xs leading-4">{schema_name}</td>
                    </tr>
                    <tr>
                        <td className="text-white w-24 text-left text-xs">
                            <b>Owner:</b>
                        </td>
                        <td className="text-white max-w-td text-right text-xs leading-4">{owner}</td>
                    </tr>
                    {template && template.issued_supply && (
                        <tr>
                            <td className="text-white w-24 text-left text-xs">
                                <b>Issued Supply:</b>
                            </td>
                            <td className="text-white max-w-td text-right text-xs leading-4">
                                {template.issued_supply}
                            </td>
                        </tr>
                    )}
                    {median && (
                        <tr>
                            <td className="text-white w-24 text-left text-xs">
                                <b>Suggested Median:</b>
                            </td>
                            <td className="text-white max-w-td text-right text-xs leading-4">
                                {formatNumber(median / Math.pow(10, token_precision))} WAX
                            </td>
                        </tr>
                    )}
                    {min && (
                        <tr>
                            <td className="text-white w-24 text-left text-xs">
                                <b>Min Sold:</b>
                            </td>
                            <td className="text-white max-w-td text-right text-xs leading-4">
                                {formatNumber(min / Math.pow(10, token_precision))} WAX
                            </td>
                        </tr>
                    )}
                    {max && (
                        <tr>
                            <td className="text-white w-24 text-left text-xs">
                                <b>Max Sold:</b>
                            </td>
                            <td className="text-white max-w-td text-right text-xs leading-4">
                                {formatNumber(max / Math.pow(10, token_precision))} WAX
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default PreviewDetailsTable
