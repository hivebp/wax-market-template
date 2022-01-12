import { LoadingIndicator } from './LoadingIndicator'

describe('LoadingIndicator', () => {
    it('should render', () => {
        const wrapper = shallow(<LoadingIndicator />)
        expect(wrapper).toMatchSnapshot()
    })
})
