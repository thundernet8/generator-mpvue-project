import Vue from 'vue';

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        onLoad?(): void;
        onUnload?(): void;
        onHide?(): void;
        onShow?(): void;
        onReady?(): void;
        onShareAppMessage?(res): any;
    }
}

declare module 'vue/types/vue' {
    interface VueConstructor {
        mpType: string;
    }

    interface Vue {}
}
