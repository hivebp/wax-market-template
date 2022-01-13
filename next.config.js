const ANALYZE = false

module.exports = {
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
}
