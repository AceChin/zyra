<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="$t('home.upgrade')"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft">
    </van-nav-bar>
    <main>
      <div class="myInfo">
        <div class="top">
          <img class="icon" src="../../assets/images/invitedIcon.png" alt="">
          {{ info.name }}
        </div>
      </div>

      <div class="nextLevel">
        <p class="title">升级为 {{ info.nextName }}</p>
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
import { useWeb3Store, useLoadingStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t : $t } = useI18n()
const web3Store = useWeb3Store()
const info = ref({})

const fetchLevelInfo = async () => {
  const data = await web3Store.fetchLevelInfo()
  info.value = data
  console.log(data)
}

fetchLevelInfo()

const onClickLeft = () => history.back();


</script>
<style lang="scss" scoped>
@import url("./update.scss");
</style>