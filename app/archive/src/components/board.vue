<template>
  <div class="wrapper">
    <h2>{{title}}</h2>
    <p>{{content}}</p>
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        }
    },
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<style lang="less" scoped>
.wrapper {
    background: #fff;
    border-bottom: 1px solid #f5f5f5;
    padding: 20rpx;
    > h2 {
        font-size: 40rpx;
        text-align: center;
        margin-bottom: 20rpx;
    }
    > p {
        font-size: 30rpx;
        line-height: 1.8;
    }
}
</style>
