import React from 'react'

/**
 * @type {import('next').NextPage<{ statusCode?: number }>}
 */
const ErrorPage = ({ statusCode }) => {
    return (
        <p data-testid="error">
            {statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}
        </p>
    )
}

ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default ErrorPage
