<template>
  <div class="page">
    <header>
      <p class="title">{{ $t('home.assets') }}</p>
      <p class="recordIcon" style="margin-left: auto;margin-right: 0.8rem;" @click="() => toPage('/assets/withdrawRecord')">
        <img class="icon" src="../../assets/images/record.svg" alt="">
        {{ $t('home.withdrawRecord') }}
      </p>
      <p class="recordIcon" @click="() => toPage('/assets/record')">
        <img class="icon" src="../../assets/images/record.svg" alt="">
        {{ $t('home.record') }}
      </p>
    </header>
    <main>
      <div class="total">
        <p class="title">{{ $t('home.total') }}</p>
        ≈<span class="price">${{ totalAmount }}</span>
      </div>
      <div class="records">
        <AssetsItem
          v-for="item of assetsStore.assetsList"
          :key="item.id"
          :loading="loading"
          v-bind="item"
          :onWithdraw="onWithdraw"
          :onTransfer="onTransfer"
          :flashExchange="flashExchange"
          :onRecharge="onRecharge" />
      </div>
    </main>

    <Popup :visible="rechargeVisible" :onClose="() => rechargeVisible = false">
      <template #default>
        <div class="popupContent">
          
          <div class="title">{{ $t('tips.plsInput') }}</div>
          <TuppuInput
            v-model="rechargeValue"
            :style="{margin: '0.6rem 0', borderColor: 'var(--van-primary-color)'}"
            placeholder=""
            type="number"
            suffix="USDT" />
          <van-button
            class="button"
            type="primary"
            :loading="loading"
            :disabled="!rechargeValue || rechargeValue == 0"
            round
            @click="onSureRecharge">{{ $t('button.sure') }}</van-button>
        </div>
      </template>
    </Popup>

    <Tabbar nowUrl="/home" />
    <Confirm ref="confirm" />
  </div>
</template>
<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from "vue-router";
import Tabbar from "../../components/Tabbar.vue";
import AssetsItem from './components/AssetsItem.vue'
import Popup from "../../components/Popup.vue";
import TuppuInput from '../../components/TuppuInput.vue';
import Confirm from '../../components/Confirm.vue';
import { useAssetsStore, useWeb3Store, useLoadingStore } from '@/stores'
import { showToast } from "vant";
import { useI18n } from 'vue-i18n'
const { t : $t } = useI18n()

const router = useRouter();
const route = useRoute();
const assetsStore = useAssetsStore()
const loadingStore = useLoadingStore()
const web3Store = useWeb3Store()

const rechargeVisible = ref(false)
const loading = ref(false)
const rechargeValue = ref('')
const needCharge = ref(null)
const confirm = ref(null)

const walletConfig = computed(() => assetsStore.walletConfig || {})

const totalAmount = computed(() => {
  let total = 0
  assetsStore.assetsList.forEach(i => {
    console.log(i.token)
    if(i.token == 'USDT' || i.token == 'TPUA') {
      total += Number(i.balance)
      total += Number(i.frozen)
    }
  })
  return total
})

const onWithdraw = () => {
  router.push('/assets/withdraw')
}
const onTransfer = () => {  
  router.push('/assets/withdraw')
}
const flashExchange = () => {

}
const onRecharge = () => {
  rechargeVisible.value = true
}

onMounted(async () => {

  assetsStore.fetchAssetsAccounts().then(() => {
    nextTick(() => {
      if(window.needCharge) {
        onRecharge()
        window.needCharge = false
      }
    })
  })
  assetsStore.fetchWalletConfigs()
})

const onSureRecharge = async () => {
  try {
    loading.value = true
    if(!rechargeValue.value)
      return
    if(!web3Store.web3Info)
      await web3Store.connectImTokenWallet()
    const isTrueChain = await web3Store.fetchChainId()
    if(!isTrueChain) {
      await confirm.value.open($t('tips.changeNetWork'))
      await web3Store.changeChain()
    }
    const { address } = await assetsStore.fetchRechargeAddress()
    const txHash = await web3Store.transferU(rechargeValue.value, address)
    await assetsStore.confirmCharge({ txHash })
    showToast($t('tips.chargeSuccess'))
    rechargeVisible.value = false
    assetsStore.fetchAssetsAccounts()
    rechargeValue.value = ''
    loading.value = false
  } catch(e) {
    console.log(e)
    loading.value = false
  }
}

const toPage = (path) => {
  router.push({ path });
};
</script>
<style lang="scss" scoped>
  @import url("./index.scss");
</style>