import { render } from '@testing-library/react'
import Privacy from './index'

describe('::ExplorerPage', () => {
    it('renders without crashing', async () => {
        const { container } = render(<Privacy />)
        expect(container).toMatchSnapshot()
    })
})
