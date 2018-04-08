import Page from './index.vue';
import { WrapPage } from 'common-mpvue';

/* tslint:disable */
new WrapPage(Page);
/* tslint:enable */

export default {
    config: {
        backgroundTextStyle: 'black',
        navigationBarBackgroundColor: '#ffffff',
        navigationBarTitleText: '示例页面',
        navigationBarTextStyle: 'black'
    }
};
