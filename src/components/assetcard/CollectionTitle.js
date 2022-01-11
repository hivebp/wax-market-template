import Link from "../common/util/input/Link";
import cn from "classnames";
import config from "../../config.json";
import React from "react";

function CollectionTitle(props) {
    const collection = props['collection'];
    const hasLink = props['hasLink'];

    return (
        <Link href={'/collection/' + collection['collection_name']} hasLink={hasLink}>
            <div className={cn(
                'relative flex items-center leading-4 p-2',
                'text-white leading-relaxed text-sm',
                'cursor-pointer'
            )}>
                { collection['img'] ? <div className="h-4 rounded-lg overflow-hidden">
                    <img src={config.ipfs + collection['img']} className="collection-img" alt="none"/>
                </div> : '' }
                <div className="font-light ml-2 mr-auto opacity-60 truncate">{collection['collection_name']}</div>
            </div>
        </Link>
    );
}

export default CollectionTitle;