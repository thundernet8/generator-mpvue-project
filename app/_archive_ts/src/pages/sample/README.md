## 说明

本页面使用 Vue 默认的组件写法，导出 VueOptions 对象

```js
export default {
    data() {
        return {}
    },

    ...
}
```

同样可以使用`Vue.extend`写法，语法类似

```js
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {};
    }
});
```
