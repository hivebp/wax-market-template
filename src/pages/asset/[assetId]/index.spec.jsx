import { render, screen } from '@testing-library/react'
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
            asset = {
                asset_id: 'test-id',
                auctions: [],
                backed_tokens: [],
                burned_at_block: '1',
                burned_at_time: '1',
                burned_by_account: 'test.wam',
                collection: {
                    allow_notify: false,
                },
                contract: 'test-contract',
                data: {},
                immutable_data: null,
                is_burnable: false,
                is_transferable: false,
                minted_at_block: '2',
                minted_at_time: '2',
                mutable_data: null,
                name: 'Test-Asset',
                owner: 'test-owner.wam',
                prices: [],
                sales: [],
                schema: {
                    schema_name: 'test-schema',
                },
                template: {
                    issued_supply: 'test-supply',
                },
                template_mint: '3',
                transferred_at_block: '4',
                transferred_at_time: '4',
                updated_at_block: '5',
                updated_at_time: '5',
            }
        })

        it('renders', async () => {
            const { container } = render(<AssetIdPage asset={asset} />)
            expect(screen.queryByTestId('error')).toBeNull()
            expect(container).toMatchSnapshot()
        })
    })
})
