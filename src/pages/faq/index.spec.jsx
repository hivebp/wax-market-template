import { render } from '@testing-library/react'
import FrequentlyAskedQuestionsPage from './index.page'

describe('::FrequentlyAskedQuestionsPage', () => {
    it('renders without crashing', async () => {
        const { container } = render(<FrequentlyAskedQuestionsPage />)
        expect(container).toMatchSnapshot()
    })
})
