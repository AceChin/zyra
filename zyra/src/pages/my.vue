<template>
  <div class="page">
    <div class="content">
      <img class="img" src="" alt="">
      <p class="address">{{ web3Store.accountMask }}</p>
      <div class="column">
        <span>{{ web3Store.userInfo?.nodeName }}</span>
        <span>{{ web3Store.userInfo?.levelName }}</span>
      </div>
    </div>
    <Tabbar nowUrl="/home" />
  </div>
</template>
<script setup>
import Tabbar from "../components/Tabbar.vue";
import { useWeb3Store } from '@/stores'

const web3Store = useWeb3Store()

</script>
<style lang="scss" scoped>
.page {
  padding: 1rem;

  .content {
    border: 1px solid var(--van-primary-color);
    border-radius: 0.5rem;
    width: 100%;
    margin: 1rem auto;
    padding: 1rem;
    align-items: center;
    display: flex;

    .img {
      width: 2.53rem;
      height: 2.53rem;
      margin-right: 0.5rem;
      border-radius: 50%;
      background-color: aqua;
    }
    .address {
      font-weight: 600;
      font-size: 0.8rem;
      color: var(--van-primary-color);
      line-height: 1.23rem;
    }
    .column {
      font-weight: 600;
      font-size: 0.7rem;
      color: #B8B8B8;
      display: flex;
      flex-direction: column;
      margin-left: auto;
      text-align: right;
    }
  }
}
</style>