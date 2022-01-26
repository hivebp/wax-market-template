import { act, render } from '@testing-library/react'
import { flush, on, reset, setMatchMode } from '../../../../__mocks__/fetch'
import * as fixtures from '../../../../__mocks__/fixtures'
import BlendIdPage from './index.page'

jest.mock('../../../../hooks/ual.js')

describe('::BlendIdPage', () => {
    afterEach(reset)

    it('renders correctly', async () => {
        const blend = fixtures.blenderizerBlend()
        const template = fixtures.template()
        on({ rows: [blend] }, 'https://api.hivebp.io/v1/chain/get_table_rows')
        on(
            { data: template },
            'https://wax.api.atomicassets.io/atomicassets/v1/templates/test-collection/test-template-id',
        )

        setMatchMode('url')
        const { container } = render(
            <BlendIdPage collectionName={blend.collection} templateId={template.template_id} />,
        )
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
    })
})
