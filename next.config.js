const ANALYZE = false

module.exports = {
    pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
    webpack: (config, { isServer }) => {
        if (ANALYZE) {
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                    analyzerPort: isServer ? 8888 : 8889,
                    openAnalyzer: true,
                }),
            )
        }
        return config
    },
    env: {
        version: '0.0.1',
    },
    // experimental: {
    //     reactRoot: true,
    //     concurrentFeatures: true,
    // },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}
