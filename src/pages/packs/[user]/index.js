import qs from 'qs'
import React from 'react'
import Packs from '../../../components/packs'

const PacksPage = (props) => {
    return <Packs {...props} />
}

PacksPage.getInitialProps = async (ctx) => {
    const c = ctx.query.user

    const paths = ctx.asPath.split('/')

    const values = qs.parse(paths[2].replace(c + '?', ''))

    values['user'] = c

    return values
}

export default PacksPage
