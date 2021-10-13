import React from "react";
import cn from "classnames";
import {formatNumber} from "../helpers/Helpers";

const Bids = (props) => {
    const bids = props['bids'];

    const numBids = bids.length;

    return numBids > 0 ? (
        <div className={cn(
            'm-auto w-80 h-auto lg:h-24',
            'flex text-center justify-evenly flex-wrap lg:justify-center',
            'text-sm text-white mt-5 overflow-y-auto',
        )}>
            {bids.sort((a, b) => b.number - a.number).map(bid =>
                <table className="w-full mb-2">
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
            )}
        </div>
    ) : <div/>;
};

export default Bids;