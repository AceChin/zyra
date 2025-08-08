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

    <div class="box">
      <div class="infoBox">
        <div class="grayLabel">{{ $t('home.receiveAddress') }}：</div>
        <div class="whiteLabel">{{ web3Store.userInfo?.address }}</div>
        <div class="grayLabel" style="margin-top: 1.3rem">{{ $t('home.network') }}：</div>
        <div class="mainGrayLabel">BNB Smart Chain(BEP20)</div>
        <div class="grayLabel" style="margin-top: 1.6rem">{{ $t('home.amount') }}：</div>
        <!-- <TuppuInput
          v-model="rechargeValue"
          :style="{margin: '0.6rem 0'}"
          :placeholder="$t('tips.minNumber', { number: walletConfig.withdrawMin })"
          type="number"
          :max="Number(total)"
          suffix="USDT" /> -->

        <div class="inputBox">
          <van-field
            v-model="rechargeValue"
            style="background-color: transparent;height: 38px;padding-left: 7px;"
            :placeholder="$t('tips.minNumber', { number: walletConfig.withdrawMin })"
            type="number"
            :max="Number(total)"
            :border="false"
            class="input"
          />
           <p class="suffix">USDT</p>
           <van-button class="inputBtn" type="primary" @click="clickAll">{{ $t('button.all') }}</van-button>
        </div>
        <div class="row">
          <div class="grayLabel">{{ $t('button.fee') }} ：{{ walletConfig.withdrawFee || 0 }}U</div>
          <div class="grayLabel">{{ $t('home.canUse') }}：{{ total }} USDT</div>
        </div>
      </div>
    </div>
    <div class="tipsBox">
      <img class="icon" src="@/assets/images/tipsIcon.png" alt="" />
      <div style="display:flex;flex-direction: column;">
        <div class="whiteLabel">{{ $t('home.beCareful') }}：</div>
        <div class="whiteLabel">{{ $t('tips.checkAddress') }}</div>
      </div>
    </div>
    <van-button
      class="button"
      type="primary"
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
  await web3Store.checkAddress()
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

const clickAll = () => {
  rechargeValue.value = total.value
}

</script>
<style lang="scss" scoped>
.page {
  padding: 1.6rem;
}

  .box {
    position: relative;
    border-radius: 15px;
    padding: 1px; /* 边框厚度 */
    background: linear-gradient(180deg, rgba(132, 107, 214, 1), rgba(165, 141, 244, 0.2), rgba(124, 97, 244, 0.1));
  }
  .infoBox {
    border-radius: var(--van-dialog-radius);
    background: linear-gradient(#22215B 0%, #2B2689 100%);
    border-radius: 14px;
    padding: 1rem;
  }

.grayLabel {
  font-weight: 600;
  font-size: 0.9rem;
  color: #9BA1B6;
  line-height: 1rem;
  padding-bottom: 6px;
}
.mainGrayLabel {
  font-size: 1rem;
  color: #E8E8E8;
  line-height: 1.3rem;
}
.whiteLabel {
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.3rem;
  word-break: break-all;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.inputBox {
  display: flex;
  background-color: #1E255A;
  border: 1px solid #464F87;
  border-radius: 6px;
  // height: 3.08rem;
  align-items: center;
  padding: 4px;
  box-sizing: border-box;

  .suffix {
    font-size: 0.9rem;
    color: #B8B8B8;
    line-height: 1rem;
    margin-right: 0.8rem  ;
  }
  .inputBtn {
    height: 2.53rem;
    border-radius: 5px;
    border: none;
    min-width: 57px;
    max-width: 57px;
    max-height: 38px;
  }

  ::v-deep(.van-field__control) {
    height: 100%;
  }
}

.tipsBox {
  padding: 1rem;
  background: #192152;
  border-radius: 1rem;
  display: flex;
  margin-top: 0.8rem;

  .icon {
    width: 2rem;
    height: 2rem;
    margin-right: 0.8rem;
  }

  .whiteLabel {
    font-size: 0.9rem;
    color: #E8E8E8;
  }
}

.button {
  margin: 0 auto;
  margin-top: 1.6rem;
  display: block;
  width: 100%;
  border-radius: 10px;
  height: 58px;
}
</style>