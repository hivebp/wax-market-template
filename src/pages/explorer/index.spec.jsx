import { act, render } from '@testing-library/react'
import { flush, on, reset, waitingRequests } from '../../__mocks__/fetch'
import ExplorerPage from './index'

describe('::ExplorerPage', () => {
    // afterEach(report)
    afterEach(reset)

    it('renders without crashing', async () => {
        on({ data: [] }, 'https://api.hivebp.io/v1/chain/get_table_rows')
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicassets/v1/collections?page=1&limit=10&order=desc&sort=created&collection_whitelist=official.wax',
        )
        const { container } = render(<ExplorerPage tab="collections" />)
        expect(waitingRequests).toHaveLength(1)
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
    })
})
