import { act, render } from '@testing-library/react'
import { flush, on, reset, setMatchMode } from '../../../../__mocks__/fetch'
import * as fixtures from '../../../../__mocks__/fixtures'
import BlenderizerCollectionTemplateIdPage from './index.page'

jest.mock('../../../../hooks/ual.js')

/** @param {string | BodyInit | undefined | null} data */
// @ts-ignore
const parse = (data) => (data ? JSON.parse(data) : undefined)

describe('::BlenderizerCollectionTemplateIdPage', () => {
    afterEach(reset)

    it('renders correctly', async () => {
        const blend = fixtures.blenderizerBlend()
        const template = fixtures.template()
        on(
            { rows: [blend] },
            (url, init) =>
                url === 'https://api.hivebp.io/v1/chain/get_table_rows' && parse(init?.body).code === 'blenderizerx',
        )
        on(
            {},
            (url, init) =>
                url === 'https://api.hivebp.io/v1/chain/get_table_rows' && parse(init?.body).code === 'marketmapper',
        )
        on(
            { data: template },
            'https://wax.api.atomicassets.io/atomicassets/v1/templates/test-collection/test-template-id',
        )
        on(
            // add the templates we need for the blend
            {
                data: [
                    fixtures.template({ template_id: '1', name: 'A' }),
                    fixtures.template({ template_id: '2', name: 'B' }),
                ],
            },
            'https://wax.api.atomicassets.io/atomicassets/v1/templates?has_assets=true&collection_whitelist=official.wax&limit=1000',
        )

        setMatchMode('url')
        const { container } = render(
            <BlenderizerCollectionTemplateIdPage collectionName={blend.collection} templateId={template.template_id} />,
        )
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
    })
})
