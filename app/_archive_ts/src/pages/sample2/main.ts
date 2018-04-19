import Page from './index.vue';
import { WrapPage } from '@gfe/wxapp-common-vue';

/* tslint:disable */
new WrapPage(Page);
/* tslint:enable */

export default {
    config: {
        backgroundTextStyle: 'black',
        navigationBarBackgroundColor: '#ffffff',
        navigationBarTitleText: '示例页面2',
        navigationBarTextStyle: 'black'
    }
};
