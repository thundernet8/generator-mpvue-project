<template>
  <div class="container">
    <section class="section main-container">
      <board :title="示例页面2" :content="使用TypeScript+Vue Class组件写法" />
    </section>
    <section class="placeholder-container"/>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
.main-container {
    border-top: 2rpx solid #f5f5f5;
    padding: 20rpx 0;
}
</style>
