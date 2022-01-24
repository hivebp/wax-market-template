import { render } from '@testing-library/react'
import ExplorerPage from './index'

describe('::ExplorerPage', () => {
    it.skip('renders without crashing', () => {
        const { container } = render(<ExplorerPage tab="collections" />)
        expect(container).toMatchSnapshot()
    })
})
