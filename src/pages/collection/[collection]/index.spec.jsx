import { act, render } from '@testing-library/react'
import { flush, on, reset } from '../../../__mocks__/fetch'
import * as fixtures from '../../../__mocks__/fixtures'
import CollectionPage from './index.page'

jest.mock('../../../hooks/ual.js')

describe('::CollectionPage', () => {
    afterEach(reset)

    it('renders correctly', async () => {
        const collection = fixtures.collection()
        on({ data: collection }, 'https://wax.api.atomicassets.io/atomicassets/v1/collections/test-collection')
        const { container } = render(<CollectionPage collection={collection.collection_name} />)
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
    })
})
