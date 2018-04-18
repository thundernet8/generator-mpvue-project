<template>
  <div class="container">
    <section class="section main-container">
      <board :title="title" :content="content" />
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
