var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    PORT: 8080,
    MOCK: process.env.MOCK,
    PKG_TYPE: process.env.PKG_TYPE
});
