import qs from 'qs'
import React from 'react'
import Inventory from '../../../components/inventory'

const InventoryPage = (props) => {
    return <Inventory {...props} />
}

InventoryPage.getInitialProps = async (ctx) => {
    const c = ctx.query.user

    const paths = ctx.asPath.split('/')

    const values = qs.parse(paths[2].replace(c + '?', ''))

    values['user'] = c

    return values
}

export default InventoryPage
