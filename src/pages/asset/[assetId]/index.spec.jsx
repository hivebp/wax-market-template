import { render, screen } from '@testing-library/react'
import * as fixtures from '../../../__mocks__/fixtures'
import AssetIdPage from './index.page'

describe('::AssetIdPage', () => {
    it('renders as an error', async () => {
        // no asset given
        const { container } = render(<AssetIdPage />)
        expect(screen.queryByTestId('error')).not.toBeNull()
        expect(container).toMatchSnapshot()
    })

    describe('with asset', () => {
        /**
         * @type {import('../../../api/fetch').Asset}
         */
        let asset
        beforeEach(() => {
            asset = fixtures.asset()
        })

        it('renders', async () => {
            const { container } = render(<AssetIdPage asset={asset} />)
            expect(screen.queryByTestId('error')).toBeNull()
            expect(container).toMatchSnapshot()
        })
    })
})
