import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import App from './App.vue';
import { wrap, wx } from '@gfe/wxapp-common-vue';
import config from './config';
import appProps from './common/app';

const pkg = require('../package.json');

// 设置wx debug模式
if (process.env.NODE_ENV !== 'production') {
    wx.setEnableDebug({ enableDebug: true });
}

Vue.config.productionTip = false;
// 添加小程序hooks http://mpvue.com/mpvue/#_4
Component.registerHooks([
    // pages
    'onLoad', // 监听页面加载
    'onShow', // 监听页面显示
    'onReady', // 监听页面初次渲染完成
    'onHide', // 监听页面隐藏
    'onUnload', // 监听页面卸载
    'onPullDownRefresh', // 监听用户下拉动作
    'onReachBottom', // 页面上拉触底事件的处理函数
    'onShareAppMessage', // 用户点击右上角分享
    'onPageScroll', // 页面滚动
    'onTabItemTap' //当前是 tab 页时 // 点击 tab 时触发 （mpvue 0.0.16 支持）
]);

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
                    text: '示例1',
                    iconPath: 'static/images/uc.png',
                    selectedIconPath: 'static/images/uc-active.png'
                },
                {
                    pagePath: 'pages/sample2/sample2',
                    text: '示例2',
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
