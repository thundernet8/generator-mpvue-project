<template>
  <div class="container">
    <section class="section main-container">
      <div v-if="loading" class="loader"><img src="/static/images/loading.gif" /></div>
      <ul>
          <li v-for="(example, index) in examples" :key="index">
              <board :title="example.title" :content="example.content" />
          </li>
      </ul>
    </section>
    <section class="placeholder-container"/>
  </div>
</template>

<script>
import { exampleRequest } from '@/api/home.js';
import createStore from '@/store/main';
import board from '@/components/board';

const store = createStore();

export default {
    name: 'Index',

    components: { board },

    data() {
        return {
            loading: false
        };
    },

    computed: {
        examples() {
            return store.state.examples;
        }
    },

    beforeCreate() {
        console.log('beforeCreate');
    },

    created() {
        console.log('created');
    },

    beforeMount() {
        console.log('beforeMount');
    },

    mounted() {
        console.log('mounted');
    },

    methods: {
        getExampleList() {
            this.loading = true;
            exampleRequest()
                .then(resp => {
                    const examples = resp.data || [];
                    store.commit('updateExamples', examples);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },

    onLoad() {
        console.log('onLoad');
    },

    onUnload() {
        console.log('onUnload');
    },

    onHide() {
        console.log('onHide');
    },

    onShow() {
        console.log('onShow');
        this.getExampleList();
    },

    onReady() {
        console.log('onReady');
    },

    onShareAppMessage(res) {
        return {
            title: getApp().name,
            path: '/pages/index/index'
        };
    }
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
