import { render, screen } from '@testing-library/react'
import AuctionIdPage from './index.page'

describe('::AuctionIdPage', () => {
    it('renders as an error', async () => {
        // no asset given
        const { container } = render(<AuctionIdPage />)
        expect(screen.queryByTestId('error')).not.toBeNull()
        expect(container).toMatchSnapshot()
    })

    // describe('with asset', () => {
    //     /**
    //      * @type {import('../../../api/fetch').Asset}
    //      */
    //     let asset
    //     beforeEach(() => {
    //         asset = fixtures.asset()
    //     })

    //     it('renders', async () => {
    //         const { container } = render(<AuctionIdPage asset={asset} />)
    //         expect(screen.queryByTestId('error')).toBeNull()
    //         expect(container).toMatchSnapshot()
    //     })
    // })
})
