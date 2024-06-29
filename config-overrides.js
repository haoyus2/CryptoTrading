const webpack = require("webpack");

module.exports = function override(config, env) {
    // Polyfills for Node.js core modules
    config.resolve.fallback = {
        assert: require.resolve("assert"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        url: require.resolve("url"),
        querystring: require.resolve("querystring-es3"),
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        buffer : require.resolve('buffer/'),
        fs: false,
        net: false,
        tls: false,
    };
    // ProvidePlugin to shim global variables
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: "process/browser", // if you also need a process polyfill
        }),
    ]);
    return config;
};
