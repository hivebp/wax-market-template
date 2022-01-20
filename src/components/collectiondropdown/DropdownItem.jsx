import cn from 'classnames'
import React from 'react'
import Dropdown from 'react-dropdown'

/** @typedef {import('react-dropdown').Option} Option */

/**
 * @typedef {Object} DropdownItemProps
 * @property {string} header
 * @property {Option[]} options
 * @property {(option: Option) => void} onChange
 * @property {string | Option} value
 **/

/**
 * @type {React.FC<DropdownItemProps>}
 */
const DropdownItem = ({ header, options, onChange, value }) => {
    return (
        <div className={cn('mb-6')}>
            <div className={cn('w-full inline-block m-0')}>
                <div className="text-neutral font-normal text-sm mb-2">{header}</div>
                <Dropdown
                    options={options}
                    onChange={onChange}
                    value={value}
                    placeholder={header}
                    className={cn('w-full rounded-lg', 'border border-solid border-paper')}
                />
            </div>
        </div>
    )
}

export default DropdownItem
