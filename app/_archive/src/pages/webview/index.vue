<template>
  <web-view
    :src="url"
    class="webview"
    @message="onWebviewMsg" />
</template>

<script>
export default {
    name: 'Webview',
    components: {},

    data() {
        return {
            url: '',
            utm_source: '',
            shouldCheckParams: false,
            canIUsewebView: wx.canIUse('web-view') || false
        };
    },

    created() {},

    mounted() {
        if (!this.canIUsewebView) {
            wx.showToast({
                title: '你的微信版本过低，不能使用该页面功能',
                icon: 'none'
            });
        } else {
            const url = decodeURIComponent(this.$root.$mp.query.url);
            if (!/^https?/i.test(url)) {
                wx.showModal({
                    title: '提示',
                    content: '不合适的访问链接',
                    showCancel: false
                });
            } else {
                const app = getApp();
                this.url = url;
                this.utm_source = app.name;
                const query = Object.assign({}, app.utils.parseUrlQuery(url), {
                    ...this.$root.$mp.query
                });
                if (query.wx_title) {
                    wx.setNavigationBarTitle({
                        title: query.wx_title
                    });
                }
                if (query.wx_front_color || query.wx_bg_color) {
                    wx.setNavigationBarColor({
                        backgroundColor: query.wx_bg_color || '#ffffff',
                        frontColor:
                            query.wx_front_color === 'white'
                                ? '#ffffff'
                                : '#000000'
                    });
                }
                if (app.debug) {
                    console.log(app.getPageLink());
                }
            }
        }
    },

    methods: {
        onWebviewMsg(e) {
            // console.log('onWebviewMsg', e);
            // this.url = 'https://baidu.com';
            // 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息
        }
    }
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
