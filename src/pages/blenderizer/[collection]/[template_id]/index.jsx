import qs from 'qs'
import React from 'react'
import { getBlenderizer, getTemplate } from '../../../../api/fetch'
import BlenderizerComponent from '../../../../components/blends/BlenderizerComponent'

const BlenderizerPage = (props) => {
    return <BlenderizerComponent {...props} />
}

BlenderizerPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')
    const templateId =
        paths[paths.length - 1].indexOf('?') > 0
            ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?'))
            : paths[paths.length - 1]
    const collectionName = paths[paths.length - 2]

    const values = qs.parse(paths[2].replace(`${templateId}?`, ''))

    const template = await getTemplate({ templateId, collectionName })

    values['template'] = template && template['success'] && template['data']
    values['blend'] = await getBlenderizer(templateId)

    return values
}

export default BlenderizerPage
