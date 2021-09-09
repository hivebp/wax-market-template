import React from "react";
import cn from "classnames";
import {formatNumber} from "../helpers/Helpers";

const Bids = (props) => {
    const bids = props['bids'];

    const numBids = bids.length;

    return numBids > 0 ? (
        <div className={cn(
            'relative m-auto h-auto mh-40 lg:h-24',
            'flex text-center justify-evenly flex-wrap lg:justify-center',
            'text-sm mt-20 mr-auto ml-auto'
        )}>
            <div className={'Bids'}>
                {bids.sort((a, b) => b.number - a.number).map(bid =>
                    <div className={'Bid'}>
                        <table className="w-full">
                            <tbody>
                            <tr>
                                <td className="text-white text-left"><b>Account:</b></td>
                                <td className="text-white text-right">{bid.account}</td>
                            </tr>
                            <tr>
                                <td className="text-white text-left"><b>Bid:</b></td>
                                <td className="text-white text-right">{formatNumber(bid.amount / (100000000.0))} WAX</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    ) : <div/>;
};

export default Bids;