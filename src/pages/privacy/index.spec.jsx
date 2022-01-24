import { render } from '@testing-library/react'
import PrivacyPage from './index.page'

describe('::PrivacyPage', () => {
    it('renders without crashing', async () => {
        const { container } = render(<PrivacyPage />)
        expect(container).toMatchSnapshot()
    })
})
