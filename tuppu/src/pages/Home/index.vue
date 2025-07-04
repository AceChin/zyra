<template>
  <div class="page">
    <van-nav-bar safe-area-inset-top fixed placeholder :border="false">
      <template #left>
        <img @click="openMenu" class="menu" src="@/assets/images/menu.svg" />
        <img class="logo" src="@/assets/images/logo.svg" />
      </template>
      <template v-if="!web3Store.accountMask" #right>
        <div class="navRight" @click="connect">
          <p class="title">{{ $t('button.linkWallet') }}</p>
          <div class="connectBtn">
            <img class="connectIcon" src="@/assets/images/connect.svg" alt="" />
          </div>
        </div>
      </template>
      <template v-else #right>
        <div class="navRight" @click.stop="changeLangue">
          <p class="title">{{ web3Store.accountMask || '' }}</p>
          <div class="connectBtn">
            {{ locale.slice(0, 2).toLocaleUpperCase() }}
          </div>
        </div>
      </template>
    </van-nav-bar>
    <main v-if="web3Store.accountMask">
      <div class="assets" @click="toAssets">
        <div class="top">
          {{ $t('home.mainAssets') }}
          <img class="down" src="@/assets/images/downArrow.svg" alt="">
          <img class="right" src="@/assets/images/rightArrow.svg" alt="">
        </div>
        <div v-if="assetsStore.assetsList.length > 0" class="info">
          <div v-for="item in 2" :key="item" class="item">
            <div class="name">
              <img class="icon" :src="icons[assetsStore.assetsList[item - 1]?.token]" alt="">
              {{ assetsStore.assetsList[item - 1]?.token }}
            </div>
            <div class="label">{{ assetsStore.assetsList[item - 1]?.balance }}</div>
          </div>
        </div>
      </div>

      <div class="operation">
        <div class="item" @click="() => toPage('/invited')">
          <img class="icon" src="@/assets/images/invite.svg" alt="">
          {{ $t('home.invite') }}
          <img class="right" src="@/assets/images/rightArrow.svg" alt="">
        </div>
        <div class="item" @click="notOpen">
          <img class="icon" src="@/assets/images/mine.svg" alt="">
          {{ $t('home.joinMine') }}
          <img class="right" src="@/assets/images/rightArrow.svg" alt="">
        </div>
      </div>

      <van-swipe class="swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>1</van-swipe-item>
        <van-swipe-item>2</van-swipe-item>
        <van-swipe-item>3</van-swipe-item>
        <van-swipe-item>4</van-swipe-item>
      </van-swipe>
      
      <div class="realTimeData">
        <div class="left">
          <div class="title">TPU/USDT{{ $t('home.realTimePrice') }}</div>
          <div class="dealInfo">
            <p class="price">$--</p>&nbsp;<p class="date">24H</p>&nbsp;--
          </div>
        </div>
          <div class="toDeal">
            {{ $t('home.deal') }}
            <img class="right" src="@/assets/images/rightArrow.svg" alt="">
          </div>
      </div>
      <h4>{{ $t('home.statistics') }}</h4>
      <div class="realTimeData statistics">
        <div class="item">
          <p class="title">--</p>
          <p class="content">{{ $t('home.output') }}</p>
        </div>
        <div class="item">
          <p class="title">--</p>
          <p class="content">{{ $t('home.destroy') }}</p>
        </div>
        <div class="item">
          <p class="title">--</p>
          <p class="content">{{ $t('home.effect') }}</p>
        </div>
        <div class="item">
          <p class="title">--</p>
          <p class="content">{{ $t('home.contribute') }}</p>
        </div>
      </div>

    </main>
    <main v-else-if="loadingStore['web3/connectImTokenWallet'] || loadingStore['web3/fetchUserInfo']">
      <van-loading class="loading" type="spinner" />
    </main>
    <main v-else>
      <van-button
        class="connectButton"
        type="primary"
        round
        @click="connect">{{ $t('button.linkWallet') }}</van-button>
      <p class="tips">{{ $t('home.tipsLinkWallet') }}</p>
      <p v-if="web3Store.inviteCode" class="invitedCode">{{ $t('home.inviteCode') }}：{{ web3Store.inviteCode }}</p>
    </main>
    <Tabbar v-if="web3Store.accountMask" nowUrl="/" />
    <LayoutSilder ref="silder" />
    <Language :visible="languageVisible" :onClose="() => languageVisible = false" />
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { ref } from 'vue'
import Tabbar from '../../components/Tabbar.vue';
import Language from '../../components/Language.vue';
import { useWeb3Store, useAssetsStore, useLoadingStore } from '@/stores'
import TPUicon from '@/assets/images/TPU.png'
import TPUAicon from '@/assets/images/TPUA.png'
import USDTicon from '@/assets/images/USDT.png'
import { useI18n } from 'vue-i18n'

const { t : $t, locale } = useI18n()


const icons = {
  TPU: TPUicon,
  TPUA: TPUAicon,
  USDT: USDTicon,
}

const router = useRouter();

const web3Store = useWeb3Store()
const assetsStore = useAssetsStore()
const loadingStore = useLoadingStore()
const silder = ref(null)
const languageVisible = ref(false)

const connect = async () => {
  await web3Store.connectImTokenWallet()
  web3Store.fetchBalance()
  await web3Store.login()
  web3Store.fetchUserInfo()
  assetsStore.fetchAssetsAccounts()
  router.push('/node')
}

const openMenu = () => {
  silder.value.open()
}

const changeLangue = () => {
  languageVisible.value = true
  // locale.value = locale.value == 'zh-CN' ? 'en-US' : 'zh-CN'
  // localStorage.setItem('language', locale.value)
}

const notOpen = () => {
  showToast($t('tips.notOpen'))
}

const toPage = (path) => {
  router.push({ path });
}

const toAssets = () => {
  router.replace({ path: '/assets' })
}


</script>
<style lang="scss" scoped>
@import url('./index.scss');
</style>