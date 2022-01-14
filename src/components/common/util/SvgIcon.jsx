import React from 'react'

export default function SvgIcon({ icon, className }) {
    return <icon.type style={{ display: 'block' }} className={className} {...icon.props} />
}
