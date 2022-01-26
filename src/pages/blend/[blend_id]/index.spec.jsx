import { act, render } from '@testing-library/react'
import { flush, on, reset } from '../../../__mocks__/fetch'
import * as fixtures from '../../../__mocks__/fixtures'
import BlendIdPage from './index.page'

jest.mock('../../../hooks/ual.js')

describe('::BlendIdPage', () => {
    afterEach(reset)

    it('renders correctly', async () => {
        on({ data: {} }, 'https://wax.api.atomicassets.io/atomicassets/v1/collections/test-collection')

        const { container } = render(<BlendIdPage blend={fixtures.neftyBlend()} />)
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
    })
})
