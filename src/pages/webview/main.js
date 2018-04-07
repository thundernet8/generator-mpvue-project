import Page from './index';
import { WrapPage } from 'common-mpvue';

new WrapPage(Page);

export default {
    config: {
        navigationBarTitleText: ''
    }
};
