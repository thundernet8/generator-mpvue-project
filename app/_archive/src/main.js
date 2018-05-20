import Vue from 'vue';
import App from './App';
import { wrap } from 'common-mpvue';
import config from './config';
import pkg from '../package.json';
import appProps from './common/_app';

// 设置wx debug模式
if (process.env.NODE_ENV !== 'production') {
    wx.setEnableDebug({ enableDebug: true });
}

Vue.config.productionTip = false;
wrap(
    App,
    {
        name: config.APP_NAME,
        version: config.VERSION,
        pkgName: pkg.name,
        domain: config.DOMAIN,
        env: config.DEBUG ? 'development' : 'production'
    },
    appProps
);

export default {
    // 这个字段走 app.json
    config: {
        pages: ['^pages/index/index', 'pages/sample/sample'], // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        window: {
            backgroundTextStyle: 'black',
            navigationBarBackgroundColor: '#ffffff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black'
        },
        tabBar: {
            color: '#69707E',
            selectedColor: '#69707E',
            backgroundColor: '#ffffff',
            list: [
                {
                    pagePath: 'pages/index/index',
                    text: '首页',
                    iconPath: 'static/images/home.png',
                    selectedIconPath: 'static/images/home-active.png'
                },
                {
                    pagePath: 'pages/sample/sample',
                    text: '我的',
                    iconPath: 'static/images/uc.png',
                    selectedIconPath: 'static/images/uc-active.png'
                }
            ]
        },
        networkTimeout: {
            request: 10000,
            downloadFile: 10000
        },
        debug: false
    }
};
