import React from "react";
import cn from "classnames";

function TabItem(props) {
    const {title, tabKey, target} = props;

    return (
        <div
            className={cn(
                'flex justify-center w-full h-full overflow-hidden rounded-md pl-5',
                'text-white text-base md:text-lg text-center no-underline font-normal opacity-100',
                'transition-opacity duration-500',
                'hover:text-white hover:opacity-100 hover:underline',
                'selected:text-white selected:opacity-100',
                {'opacity-100 bg-primary text-secondary': tabKey === target},
            )}
        >
            <div
                className={cn(
                    'my-auto px-5',
                )}
            >{title}</div>
        </div>
    );
}

export default TabItem;
