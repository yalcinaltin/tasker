const webpack = require('webpack');
const path = require('path');

var debug = typeof (process.env.NODE_ENV) ==="undefined";


const WebpackConfig = {
    devtool: debug ? "inline-sourcemap" : null,
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: 'bundle.js'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js']
    },
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react'],
                plugins: ['transform-class-properties']
            }
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: 'style!css'
        }]
    },
    plugins: debug ? [] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false,compressor: {
                warnings: false
            }})
        ]
};

module.exports = WebpackConfig;