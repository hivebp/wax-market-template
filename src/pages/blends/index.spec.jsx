import { render } from '@testing-library/react'
import { reset } from '../../__mocks__/fetch'
import BlendsPage from './index.page'

jest.mock('../../hooks/ual.js')

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

describe('::BlendsPage', () => {
    afterEach(reset)

    it('renders correctly', async () => {
        const { container } = render(<BlendsPage />)
        expect(container).toMatchSnapshot()
    })
})
