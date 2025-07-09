<template>
  <div class="page">
    <van-nav-bar
      safe-area-inset-top
      left-arrow
      :title="$t('home.sendU')"
      fixed
      placeholder
      :border="false"
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <div class="grayLabel">{{ $t('home.receiveAddress') }}：</div>
    <div class="yellowLabel">{{ web3Store.userInfo?.address }}</div>
    <div class="grayLabel" style="margin-top: 1.3rem">{{ $t('home.network') }}：</div>
    <div class="grayLabel">BNB Smart Chain(BEP20)</div>
    <div class="grayLabel" style="margin-top: 1.6rem">{{ $t('home.number') }}：</div>
    <TuppuInput
      v-model="rechargeValue"
      :style="{margin: '0.6rem 0', borderColor: 'var(--van-primary-color)'}"
      :placeholder="$t('tips.minNumber', { number: walletConfig.withdrawMin })"
      type="number"
      :max="Number(total)"
      suffix="USDT" />
    <div class="row">
      <div class="grayLabel">{{ $t('button.fee') }} ：{{ walletConfig.withdrawFee || 0 }}U</div>
      <div class="grayLabel">{{ $t('home.canUse') }}：{{ total }} USDT</div>
    </div>
    <div class="grayLabel" style="margin-top: 1.3rem">{{ $t('home.tips') }}：</div>
    <div class="yellowLabel">{{ $t('tips.checkAddress') }}</div>
    <van-button
      class="button"
      type="primary"
      round
      :disabled="rechargeValue < Number(walletConfig.withdrawMin)"
      :loading="loadingStore['assets/walletWithdraw']"
      @click="sureWithdraw">{{ $t('button.sure') }}</van-button>
    <Confirm ref="confirm" :oneButton="true" />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useAssetsStore, useLoadingStore, useWeb3Store } from '@/stores'
import TuppuInput from '../../components/TuppuInput.vue';
import Confirm from '../../components/Confirm.vue'
import { showToast } from "vant";
import { useI18n } from 'vue-i18n'
const { t : $t } = useI18n()

const web3Store = useWeb3Store()
const assetsStore = useAssetsStore()
const loadingStore = useLoadingStore()
assetsStore.fetchWalletConfigs()

const rechargeValue = ref()
const confirm = ref(null)


const walletConfig = computed(() => assetsStore.walletConfig || {})

const total = computed(() => {
  const item = assetsStore.assetsList.find(i => i.token == 'USDT') || {}
  return item.balance || 0
})

const sureWithdraw = async () => {
  console.log(walletConfig.value)
  if(rechargeValue.value < Number(walletConfig.withdrawMin)) {
    showToast($t('tips.tooSmall'))
    return
  }
  await assetsStore.walletWithdraw({
    token: 'USDT',
    amount: rechargeValue.value || 0
  })
  // showToast($t('tips.withdrawSuccess'))
  await confirm.value.open($t('tips.withdrawSuccess'))
  web3Store.fetchUserInfo()
  // history.back()
}

const onClickLeft = () => history.back();

</script>
<style lang="scss" scoped>
.page {
  padding: 1.6rem;
}
.grayLabel {
  font-weight: 600;
  font-size: 0.8rem;
  color: #B8B8B8;
  line-height: 1.6rem;
}
.yellowLabel {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--van-primary-color);
  line-height: 1.6rem;
}
.button {
  width: 57vw;
  margin: 0 auto;
  margin-top: 1.6rem;
  display: block;
}
</style>