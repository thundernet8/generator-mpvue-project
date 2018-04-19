import Page from './index.vue';
import { WrapPage } from '@gfe/wxapp-common-vue';

/* tslint:disable */
new WrapPage(Page, {
    state() {
        return {
            test: 1
        };
    },
    mutations: {
        updateTest(state: any, test) {
            state.test = test;
        }
    }
});
/* tslint:enable */

export default {
    config: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#00b2ff',
        navigationBarTitleText: '首页',
        navigationBarTextStyle: 'white'
    }
};
