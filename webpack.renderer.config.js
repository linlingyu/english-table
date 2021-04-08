const path = require('path'),
    webpack = require('webpack'),
    {CleanWebpackPlugin} = require('clean-webpack-plugin'),
    // TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    plugins = require('./webpack.plugins'),
    rules = require('./webpack.rules'),
    sourceDirectory = 'electron-browser',
    config = {
        source: path.join(__dirname, 'src', sourceDirectory),
        output: path.join(__dirname, 'out', sourceDirectory),
        cssExclude: [path.join(__dirname, 'node_modules')]
    };
// 
module.exports = {
    entry: {
        index: path.join(config.source, 'index')
    },
    output: {
        filename: '[name].js',
        path: config.output
    },
    devtool: 'source-map',
    module: {
        rules: rules.concat([{
            oneOf: [{
                test: /\.global\.(less|css)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ],
                exclude: [...config.cssExclude]
            }, {
                test: /\.global\.s[ac]ss/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.(less|css)$/i,
                use: [
                    'style-loader',
                    'css-modules-typescript-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]-[hash:base64:5]',
                                exportLocalsConvention: 'camelCaseOnly'
                            }
                        }
                    },
                    'less-loader'
                ],
                exclude: [...config.cssExclude]
            }, {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.(png|jpe?g|gif|ico|ttf|woff2?)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[name]-[hash:base64:5].[ext]'
                    }
                }]
            }, {
                test: /\.svg$/,
                use: ['@svgr/webpack']
            }]
        }])
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.json'],
        alias: {
            'flexlayout_style': path.join(__dirname, 'node_modules', 'flexlayout-react', 'style')
        }
        // plugins: [
        //     new TsconfigPathsPlugin({
        //         configFile: path.join(__dirname, 'tsconfig.json')
        //     })
        // ]
    },
    // target: 'electron-renderer', // it will get an error that global is not defined at webpack 5;
    target: 'electron-renderer',
    node: {
        __filename: false,
        __dirname: false
    },
    devServer: {
        contentBase: config.output,
        hot: true,
        writeToDisk: true
    },
    watchOptions: {
        poll: 1024,
        aggregateTimeout: 512
    },
    plugins: plugins.concat([
        // new CleanWebpackPlugin({
        //     cleanStaleWebpackAssets: false,
        //     protectWebpackAssets: false
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom'
        }),
        new webpack.WatchIgnorePlugin([
            /(less|css)\.d\.ts$/
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'English Table',
            // meta: {
            //     'Content-Security-Policy': {
            //         'http-equiv': 'Content-Security-Policy',
            //         'content': "script-src 'self' 'unsafe-eval';"
            //     }
            // },
            chunks: ['index']
        })
    ])
};