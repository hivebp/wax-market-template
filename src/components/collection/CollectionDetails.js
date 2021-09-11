import React from 'react';
import cn from "classnames";

const CollectionDetails = (props) => {
    const collection = props.collection;

    const {name, collection_name, data, market_fee} = collection;

    const {url, description} = data;

    return (
        <div className={cn(
            'lg:px-10',
            'text-base text-neutral',
        )}>
            <div className="text-5xl mb-8 w-full">{name}</div>
            <div className="text-lg font-normal leading-relaxed">{description}</div>
            <table className="mt-8 w-full font-normal">
                <tr>
                    <td className="text-neutral text-left">Collection Name:</td>
                    <td className="text-neutral text-right">{collection_name}</td>
                </tr>
                { url ? <tr>
                    <td className="text-neutral text-left">Website:</td>
                    <td className="text-neutral text-right">
                        <div className="CollectionURL">
                            <a className="font-bold h-16 text-primary leading-10" target='_blank' href={url.includes('http') ? url : `http://${url}`}>{url}</a>
                        </div>
                    </td>
                </tr> : '' }
                <tr>
                    <td className="text-neutral text-left">Market Fee:</td>
                    <td className="text-neutral text-right">{market_fee * 100}%</td>
                </tr>
            </table>
        </div>
    );
};

export default CollectionDetails;
