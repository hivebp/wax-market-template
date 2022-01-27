import { act, render } from '@testing-library/react'
import { flush, on, reset, setMatchMode } from '../../__mocks__/fetch'
import ExplorerPage from './index.page'

/** @type {(componentName: string, mapProps?: (props: any) => any) => React.FC<any>} */
export const toJSON =
    (componentName, mapProps = (props) => props) =>
    ({ children, ...props }) =>
        (
            <div>
                <h3>{componentName}</h3>
                <pre>{JSON.stringify(mapProps(props), null, 2)}</pre>
                <div>{children}</div>
            </div>
        )

jest.mock('react-bootstrap', () => ({
    Tab: toJSON('Tab', ({ title, ...props }) => props),
    Tabs: toJSON('Tabs'),
}))

describe('::ExplorerPage', () => {
    // afterEach(report)
    afterEach(reset)

    it('renders without crashing', async () => {
        on({ data: [] }, 'https://api.hivebp.io/v1/chain/get_table_rows')
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicassets/v1/collections?page=1&limit=10&order=desc&sort=created&collection_whitelist=official.wax',
        )
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicmarket/v1/assets?&collection_whitelist=official.wax&page=1&limit=12&order=desc&sort=created',
        )
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicmarket/v1/assets?&collection_whitelist=&page=1&limit=12&order=desc&sort=created',
        )
        on({ data: [] }, 'https://wax.api.atomicassets.io/atomicassets/v1/schemas?&collection_whitelist=official.wax')
        on(
            { data: [] },
            'https://wax.api.atomicassets.io/atomicassets/v1/templates?has_assets=true&collection_whitelist=official.wax&limit=1000',
        )
        setMatchMode('url')
        const { container } = render(<ExplorerPage />)
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
        await act(async () => flush(1))
        expect(container).toMatchSnapshot()
    })
})
