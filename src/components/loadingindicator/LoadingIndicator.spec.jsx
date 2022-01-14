import { render, screen } from '@testing-library/react'
import { LoadingIndicator } from './LoadingIndicator'

describe('LoadingIndicator', () => {
    it('should render', () => {
        const { container } = render(<LoadingIndicator />)
        expect(container).toMatchSnapshot()
    })
    it('should render without text', () => {
        render(<LoadingIndicator></LoadingIndicator>)
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        expect(screen.queryByTestId('loading-text')).not.toBeInTheDocument()
    })
    it('should render with text', () => {
        render(<LoadingIndicator>Hello World!</LoadingIndicator>)
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        expect(screen.getByTestId('loading-text')).toBeInTheDocument()
    })
    it('should render with text property (@deprecated)', () => {
        render(<LoadingIndicator text="Hello World!" />)
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        expect(screen.getByTestId('loading-text')).toBeInTheDocument()
    })
})
