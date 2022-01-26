import React from 'react'
import { ensureString } from '../../../../api/utils'
import BlenderizerComponent from '../../../../components/blends/BlenderizerComponent'

/**
 * @type {import('next').NextPage<Partial<import('../../../../components/blends/BlenderizerComponent').BlenderizerInitialProps>>}
 */
const BlenderizerPage = (props) => {
    if (!props.collectionName) return <div>No collection name provided</div>
    if (!props.templateId) return <div>No template id provided</div>
    return <BlenderizerComponent {...props} />
}

BlenderizerPage.getInitialProps = (ctx) => {
    return {
        templateId: ensureString(ctx.query.template_id),
        collectionName: ensureString(ctx.query.collection),
    }
}

export default BlenderizerPage
