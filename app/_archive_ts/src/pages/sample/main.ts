import Page from './index.vue';
import { WrapPage } from 'common-mpvue';

new WrapPage(Page);

export default {
    config: {
        backgroundTextStyle: 'black',
        navigationBarBackgroundColor: '#ffffff',
        navigationBarTitleText: '示例页面',
        navigationBarTextStyle: 'black'
    }
};
