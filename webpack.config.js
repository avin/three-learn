var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        'webvr-polyfill',

        'react-hot-loader/patch',
        // activate HMR for React

        'webpack-dev-server/client?http://localhost:3000',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates

        './src/index.js',
        // the entry point of our app
    ],

    output: {
        filename: 'bundle.js',
        // the output bundle

        path: path.resolve(__dirname, 'web/build'),

        publicPath: '/build/'
        // necessary for HMR to know where to load the hot update chunks
    },

    devtool: 'eval',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ],
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'DEVELOPMENT': process.env.NODE_ENV !== 'production',
        }),

        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates

        new webpack.NoEmitOnErrorsPlugin(),
        // do not emit compiled assets that include errors
    ],

    devServer: {
        host: '0.0.0.0',

        port: 3000,
        contentBase: path.resolve(__dirname, 'web'),

        historyApiFallback: true,
        // respond to 404s with index.html

        hot: true,
        // enable HMR on the server
    },
};