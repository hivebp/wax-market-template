import React from 'react'

import qs from 'qs'
import Drops from '../../components/drops'

const DropsPage = (props) => {
    return <Drops {...props} />
}

DropsPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')

    return qs.parse(paths[1].replace('drops?', ''))
}

export default DropsPage
