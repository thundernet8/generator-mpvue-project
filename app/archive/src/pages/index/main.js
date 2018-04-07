import Page from './index';
import { WrapPage } from 'common-mpvue';

new WrapPage(Page, {
    state() {
        return {
            test: 1
        };
    },
    mutations: {
        updateTest(state, test) {
            state.test = test;
        }
    }
});

export default {
    config: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#00b2ff',
        navigationBarTitleText: '首页',
        navigationBarTextStyle: 'white'
    }
};
