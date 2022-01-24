import { render } from '@testing-library/react'
import Tou from './index'

describe('::ExplorerPage', () => {
    it('renders without crashing', async () => {
        const { container } = render(<Tou />)
        expect(container).toMatchSnapshot()
    })
})
