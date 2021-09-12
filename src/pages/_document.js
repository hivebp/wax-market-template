import Document, {Head, Html, Main, NextScript} from 'next/document'

import config from "../config.json";

import React from "react";

export class MyDocument extends Document {
  render() {
      return (
          <Html lang="en">
              <Head>
                    <meta property="og:type" content="website" />
                    <meta id="og-url" property="og:url" content={config.market_url} />
                    <meta name="theme-color" content="#1A1A1A"  />
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta id="twitter-url" property="twitter:url" content={config.market_url} />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href={`https://fonts.googleapis.com/css2?family=${'Roboto'}`} rel="stylesheet" />
              </Head>
              <body>
                  <Main />
                  <NextScript />
              </body>
          </Html>
      )
  }
}

MyDocument.getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps }
};

export default MyDocument;
