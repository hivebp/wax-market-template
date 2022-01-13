import qs from 'qs'
import React from 'react'
import { getBlend } from '../../../api/fetch'
import BlendComponent from '../../../components/blends/BlendComponent'

const BlendPage = (props) => {
    return <BlendComponent {...props} />
}

BlendPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')
    const blendId =
        paths[paths.length - 1].indexOf('?') > 0
            ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?'))
            : paths[paths.length - 1]

    const values = qs.parse(paths[2].replace(`${blendId}?`, ''))

    values['blend'] = await getBlend(blendId)

    return values
}

export default BlendPage
