<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      title="升级"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft">
    </van-nav-bar>
    <main>
      <div class="myInfo">
        <div class="top">
          <img class="icon" src="../../assets/images/invitedIcon.png" alt="">
          Class 1
        </div>
      </div>

      <div class="nextLevel">
        <p class="title">升级为 Class 2</p>
        <div class="grayLabel"><span>两个市场都有Class1</span><span>1/2</span></div>
        <div class="yellowLabel"><span>小市场≥50000</span><span>69200</span></div>
      </div>
    </main>
    <Tabbar nowUrl="/home" />
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import Tabbar from "../../components/Tabbar.vue";

const onClickLeft = () => history.back();


</script>
<style lang="scss" scoped>
@import url("./update.scss");
</style>