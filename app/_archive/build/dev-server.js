require('./check-versions')();

var config = require('../config');
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

// var opn = require('opn')
var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var proxyMiddleware = require('http-proxy-middleware');
// var webpackConfig = require('./webpack.dev.conf');
var dllWebpackConfig = require('./webpack.dll.conf');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var chokidar = require('chokidar');

var DynamicEntryPlugin = require('webpack/lib/DynamicEntryPlugin');

var mock = require('./mock');

var app = express();

var depManager = require('./dep');

// 检验dll-dev.js是否编译，否则尝试编译
function dll() {
    const dllFolder = path.resolve(__dirname, '../.dll');
    if (fs.existsSync(dllFolder)) {
        const webpackConfig = require('./webpack.dev.conf');
        const dllPath = path.resolve(webpackConfig.output.path, 'dll-dev.js');
        if (fs.existsSync(dllPath)) {
            const stats = fs.statSync(dllPath);
            const now = new Date();
            const modifyTime = new Date(stats.mtime);
            if (now - modifyTime < 600 * 1000) {
                // 10min内新鲜的dll-dev.js不再更新
                return Promise.resolve(true);
            }
        }
    }

    // 超过10min未更新或不存在重新编译
    return new Promise((resolve, reject) => {
        webpack(dllWebpackConfig, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                process.stdout.write(
                    stats.toString({
                        colors: true,
                        modules: false,
                        children: false,
                        chunks: false,
                        chunkModules: false
                    }) + '\n\n'
                );
                resolve(true);
            }
        });
    });
}

function dev() {
    const webpackConfig = require('./webpack.dev.conf');
    const compiler = webpack(webpackConfig);

    // var devMiddleware = require('webpack-dev-middleware')(compiler, {
    //   publicPath: webpackConfig.output.publicPath,
    //   quiet: true
    // })

    // var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    //   log: false,
    //   heartbeat: 2000
    // })
    // force page reload when html-webpack-plugin template changes
    // compiler.plugin('compilation', function (compilation) {
    //   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    //     hotMiddleware.publish({ action: 'reload' })
    //     cb()
    //   })
    // })

    // proxy api requests
    Object.keys(proxyTable).forEach(function(context) {
        var options = proxyTable[context];
        if (typeof options === 'string') {
            options = { target: options };
        }
        app.use(proxyMiddleware(options.filter || context, options));
    });

    // simple json mock
    app.all('/mocks/*', mock);

    // handle fallback for HTML5 history API
    app.use(require('connect-history-api-fallback')());

    // serve webpack bundle output
    // app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    // app.use(hotMiddleware)

    // serve pure static assets
    var staticPath = path.posix.join(
        config.dev.assetsPublicPath,
        config.dev.assetsSubDirectory
    );
    app.use(staticPath, express.static('./static'));

    var uri = 'http://localhost:' + port;

    var _resolve;
    var _reject;
    var readyPromise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });

    // console.log('> Starting dev server...')
    // devMiddleware.waitUntilValid(() => {
    //   console.log('> Listening at ' + uri + '\n')
    //   // when env is testing, don't need open it
    //   if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    //     opn(uri)
    //   }
    //   _resolve()
    // })

    var server = app.listen(port, 'localhost');

    // for 小程序的文件保存机制
    require('webpack-dev-middleware-hard-disk')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true
    });

    compiler.run((err, stats) => {
        // console.log('callback')
        const entries = Object.keys(webpackConfig.entry);
        console.log(entries);
        chokidar.watch(process.cwd() + '/src/pages').on('add', path => {
            // console.log(`File ${path} has been added`);
            if (path.endsWith('/main.ts')) {
                const reg = new RegExp(
                    `${process.cwd()}/src/pages/(.+)/main.ts`,
                    'i'
                );
                const match = path.match(reg);
                if (match && !entries.includes(match[1])) {
                    console.log(match[1]);
                    const dep = DynamicEntryPlugin.createDependency(
                        path,
                        match[1]
                    );
                    compilation.addEntry(context, dep, match[1], err => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve();
                        }
                    });

                    compiler.watch({}).invalidate();
                }
            }
        });

        if (err) {
            _reject(err);
        } else {
            _resolve();
        }
    });

    return readyPromise;
}

var readyPromise = dll()
    .then(() => dev())
    .then(() => {
        depManager.scanDeps();
    });

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close();
    }
};
