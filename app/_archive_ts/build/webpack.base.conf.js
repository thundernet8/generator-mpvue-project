var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var MpvuePlugin = require('webpack-mpvue-asset-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

function getEntry(dir, entryFile) {
    const files = fs.readdirSync(dir);
    return files.reduce((res, k) => {
        const page = path.resolve(dir, k, entryFile);
        if (fs.existsSync(page)) {
            res[k] = page;
        }
        return res;
    }, {});
}

const appEntry = { app: resolve('./src/main.ts') };
const pagesEntry = getEntry(resolve('./src/pages'), 'main.ts');
const entry = Object.assign({}, appEntry, pagesEntry);

// const replaceStrLoader = StringReplacePlugin.replace({
//     replacements: [
//         {
//             pattern: /(wx.)(navigateTo|redirectTo)\(/g,
//             replacement(match, p1) {
//                 return match.replace(p1, 'wx._');
//             }
//         }
//     ]
// });

module.exports = {
    entry,
    target: require('mpvue-webpack-target'),
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath:
            process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue', '.json'],
        alias: {
            vue: 'mpvue',
            '@': resolve('src')
        },
        symlinks: false
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: utils.cssLoaders().css
            },
            {
                test: /\.less$/,
                use: utils.cssLoaders().less
            },
            // {
            //   test: /\.(js|vue)$/,
            //   loader: 'eslint-loader',
            //   enforce: 'pre',
            //   include: [resolve('src'), resolve('test')],
            //   options: {
            //     formatter: require('eslint-friendly-formatter')
            //   }
            // },
            {
                test: /\.ts$/,
                include: [
                    resolve('src'),
                    resolve('test'),
                    resolve('node_modules/common-mpvue')
                ],
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'mpvue-ts-loader',
                        options: {
                            checkMPEntry: true
                        }
                    },
                    // {
                    //     loader: replaceStrLoader
                    // },
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'mpvue-ts-loader',
                        options: vueLoaderConfig
                    }
                    // {
                    //     loader: replaceStrLoader
                    // }
                ]
            },
            {
                test: /\.js$/,
                include: [
                    resolve('src'),
                    resolve('test'),
                    resolve('node_modules/common-mpvue')
                ],
                use: [
                    'babel-loader',
                    {
                        loader: 'mpvue-ts-loader',
                        options: {
                            checkMPEntry: true
                        }
                    }
                    // {
                    //     loader: replaceStrLoader
                    // }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name]].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../.dll/manifest.json'),
            name: `../../dll${
                process.env.NODE_ENV === 'production' ? '' : '-dev'
            }.js`,
            sourceType: 'commonjs2'
        }),
        new StringReplacePlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../project.config.json'),
                to: path.resolve(__dirname, '../dist')
            }
        ]),
        new webpack.LoaderOptionsPlugin({
            test: /\.(vue|ts)$/,
            options: {
                ts: {
                    appendTsSuffixTo: [/\.vue$/]
                },
                entry
            }
        }),
        new MpvuePlugin()
    ]
};
