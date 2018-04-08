import Page from './index.vue';
import { WrapPage } from 'common-mpvue';

new WrapPage(Page);

export default {
    config: {
        navigationBarTitleText: ''
    }
};
