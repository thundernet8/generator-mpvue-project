var path = require('path');
var config = require('../config');
var webpack = require('webpack');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

const plugins = [];
if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin;
    plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
    entry: {
        dll: [
            'mpvue',
            'vuex',
            'common-mpvue',
            'querystring',
            'url-parse',
            'md5',
            'left-pad',
            'date-fns'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'), //config.build.assetsRoot,
        filename:
            process.env.NODE_ENV === 'production' ? 'dll.js' : 'dll-dev.js',
        publicPath:
            process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath,
        library: 'dll',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            vue: 'mpvue',
            '@': resolve('src')
        },
        symlinks: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [resolve('src'), resolve('test')],
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        ...plugins,
        new webpack.DllPlugin({
            context: __dirname,
            path: '.dll/manifest.json',
            name: '[name]'
        }),
        new webpack.HashedModuleIdsPlugin()
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     sourceMap: false
        // })
    ]
};
