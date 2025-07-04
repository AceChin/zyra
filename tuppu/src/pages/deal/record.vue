<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      title="流水记录"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <header>
      <van-button
        class="button"
        v-bind="status == 'buy' ? buyButton : defineButton"
        @click="() => changeStatus('buy')">
        全部
      </van-button>
      <van-button
        class="button"
        v-bind="status == 'buy' ? buyButton : defineButton"
        @click="() => changeStatus('buy')">
        挖矿
      </van-button>
      <van-button
        class="button"
        v-bind="status == 'buy' ? buyButton : defineButton"
        @click="() => changeStatus('buy')">
        充/提/转
      </van-button>
      <van-button
        class="button"
        v-bind="status == 'buy' ? buyButton : defineButton"
        @click="() => changeStatus('buy')">
        活动
      </van-button>

      <img class="filtrate" src="../../assets/images/filtrate.png" alt="">
    </header>

    <main>
      <div class="item">
        <div class="top">
          <p class="unit">买入 TPU</p>
          <p class="price">+500</p>
        </div>
        <div class="down">
          <p class="unit">总价 289USDT</p>
          <p class="price">单价1.28</p>
          <p class="price">2020/2/11</p>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref } from "vue";

const defineButton = {
  plain: false,
  color: "#333333",
};

const buyButton = {
  plain: true,
  type: "primary",
};

const onClickLeft = () => history.back();
</script>
<style lang="scss" scoped>
@import url("./record.scss");
</style>