import { render, screen } from '@testing-library/react'
import * as fixtures from '../../../__mocks__/fixtures'
import AuctionIdPage from './index.page'

jest.mock('../../../hooks/ual.js')

describe('::AuctionIdPage', () => {
    it('renders as an error', async () => {
        // no asset given
        const { container } = render(<AuctionIdPage />)
        expect(screen.queryByTestId('error')).not.toBeNull()
        expect(container).toMatchSnapshot()
    })

    describe('with auction', () => {
        /**
         * @type {import('../../../api/fetch').Auction}
         */
        let auction
        beforeEach(() => {
            auction = fixtures.auction()
        })

        it('renders', async () => {
            const { container } = render(<AuctionIdPage auction={auction} />)
            expect(screen.queryByTestId('error')).toBeNull()
            expect(container).toMatchSnapshot()
        })
    })
})
