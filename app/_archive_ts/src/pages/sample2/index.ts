import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import board from '@/components/board.vue';

// 必须以Component装饰器模式指定子组件
@Component({
    components: {
        board
    }
})
export default class Sample2 extends Vue {
    // 私有属性方式指定data元素
    data1: string = '';

    // get 方法指定computed的元素
    get computed1() {
        return 'computed1';
    }

    // methods直接写为类方法
    method1() {
        // do something
    }

    // 小程序生命周期
    onShow() {
        console.log('[Sample2] onShow');
    }

    // Vue生命周期
    mounted() {
        console.log('[Sample2] mounted');
    }
}
