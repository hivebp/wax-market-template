import { render } from '@testing-library/react'
import Faq from './index.page'

describe('::ExplorerPage', () => {
    it('renders without crashing', async () => {
        const { container } = render(<Faq />)
        expect(container).toMatchSnapshot()
    })
})
