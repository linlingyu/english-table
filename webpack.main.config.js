const path = require('path'),
    {CleanWebpackPlugin} = require('clean-webpack-plugin'),
    plugins = require('./webpack.plugins'),
    rules = require('./webpack.rules'),
    config = {
        source: path.join(__dirname, 'src'),
        output: path.join(__dirname, 'out')
    };
// 
module.exports = {
    entry: {
        main: path.join(config.source, 'main.ts')
    },
    output: {
        filename: '[name].js',
        path: config.output
    },
    devtool: 'source-map',
    module: {rules},
    resolve: {
        extensions: [ '.ts', '.js', '.json']
    },
    target: 'electron-main',
    node: {
        __filename: false,
        __dirname: false
    },
    plugins: plugins.concat([
        // new CleanWebpackPlugin({
        //     cleanStaleWebpackAssets: false,
        //     protectWebpackAssets: false
        // })
    ])
};