import { render } from '@testing-library/react'
import TermsOfUsePage from './index.page'

describe('::TermsOfUsePage', () => {
    it('renders without crashing', async () => {
        const { container } = render(<TermsOfUsePage />)
        expect(container).toMatchSnapshot()
    })
})
