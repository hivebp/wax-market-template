import { render } from '@testing-library/react'
import ExplorerPage from './index'

describe('::ExplorerPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<ExplorerPage tab="collections" />)
        expect(container).toMatchSnapshot()
    })
})
