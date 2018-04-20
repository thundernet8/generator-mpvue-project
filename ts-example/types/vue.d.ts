import Vue from 'vue';
import App from 'common-mpvue/types/app';
import { VuexStore } from 'common-mpvue/types/internal';
import { Store } from 'vuex/types';

interface TabItem {
    index: number;
    pagePath: string;
    text: string;
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        /**
         * 监听页面加载
         */
        onLoad?(): void;

        /**
         * 监听页面显示
         */
        onShow?(): void;

        /**
         * 监听页面初次渲染完成
         */
        onReady?(): void;

        /**
         * 监听页面隐藏
         */
        onHide?(): void;

        /**
         * 监听页面卸载
         */
        onUnload?(): void;

        /**
         * 监听用户下拉动作
         */
        onPullDownRefresh?(): void;

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom?(): void;

        /**
         *
         * @param res 用户点击右上角分享
         */
        onShareAppMessage?(res): any;

        /**
         * 页面滚动
         */
        onPageScroll?(e);

        /**
         * 当前是 tab 页时 // 点击 tab 时触发
         */
        onTabItemTap?(item);

        /**
         * Common-mpvue添加的入口App.vue独有的声明周期，在此声明周期内小程序app已经实例化完成，而其他onShow mounted声明周期内app未实例化完成
         */
        onLaunched();
    }
}

declare module 'vue/types/vue' {
    interface VueConstructor {
        mpType: string;
    }

    interface Vue {
        /**
         * 小程序app实例
         */
        $app: App;

        /**
         * 页面公用的业务Vuex Store
         */
        $store: Store<any>;
        $_store: VuexStore<any>;

        /**
         * 当前页面使用的Vuex模块State
         */
        $state: any;
    }
}
