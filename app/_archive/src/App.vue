<script>
export default {
    created() {
        this.checkVersion();
    },

    methods: {
        checkVersion() {
            const res = wx.getSystemInfoSync();
            if (res.SDKVersion < '1.6.3') {
                wx.showModal({
                    title: '提示',
                    content:
                        '你的微信版本太低，可能无法正常使用小程序功能，推荐尽快更新',
                    showCancel: false
                });
                return false;
            }

            return true;
        }
    },

    onLaunched() {
        console.log('App Launched');
    }
};
</script>

<style lang="less">
@import 'assets/styles/global.less';
</style>
