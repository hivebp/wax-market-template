import { act, render } from '@testing-library/react'
import { flush, on, reset, setMatchMode } from '../../__mocks__/fetch'
import AuctionsPage from './index.page'

jest.mock('../../hooks/ual.js')

describe('::AuctionsPage', () => {
    afterEach(reset)

    it('renders correctly', async () => {
        on({ data: [] }, 'https://api.hivebp.io/v1/chain/get_table_rows')
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicmarket/v1/auctions?state=1&&collection_whitelist=official.wax&page=1&limit=12&order=asc&sort=ending',
        )
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicassets/v1/templates?has_assets=true&collection_whitelist=official.wax&limit=1000',
        )
        on({ data: [] }, 'https://wax.api.atomicassets.io/atomicassets/v1/schemas?&collection_whitelist=official.wax')
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicassets/v1/collections?page=1&limit=10&order=desc&sort=created&collection_whitelist=official.wax',
        )
        // no asset given
        const { container } = render(<AuctionsPage />)
        setMatchMode('url')
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
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
