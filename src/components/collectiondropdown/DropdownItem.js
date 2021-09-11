import React from "react";
import Dropdown from "react-dropdown";
import cn from "classnames";

const DropdownItem = ({header, options, onChange, value}) => {
    return (
        <div className={cn(
            'mb-6',
        )}>
            <div className={cn(
                'w-full inline-block m-0',
            )}>
                <div className="text-neutral font-normal text-sm mb-2">
                    {header}
                </div>
                <Dropdown
                    options={options}
                    onChange={onChange}
                    value={value}
                    placeholder={header}
                    id="DropdownField4"
                    className={cn(
                        'w-full rounded-lg',
                        'border border-solid border-paper'
                    )}
                />
            </div>
        </div>
    );
}

export default DropdownItem;