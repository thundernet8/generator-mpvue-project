import Page from './index.vue';
import { WrapPage } from '@gfe/wxapp-common-vue';

/* tslint:disable */
new WrapPage(Page);
/* tslint:enable */

export default {
    config: {
        navigationBarTitleText: ''
    }
};
