import { wx } from '@gfe/wxapp-common-vue';

const httpRequest = wx.httpRequest
    .auth()
    .tokenKey('token')
    .qsToken();

// 示例请求
export function exampleRequest() {
    return httpRequest.GET('/examples');
}
