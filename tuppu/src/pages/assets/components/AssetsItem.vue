<template>
  <div class="item">
    <div class="top">
      <img class="icon" :src="icons[$attrs.token]" alt="" />
      <p>{{ $attrs.token }}</p>
      <div class="operate">
        <div v-if="$attrs.token == 'USDT'" class="linkBtn" @click="onWithdraw">{{ $t('button.withdraw') }}</div>
        <!-- <div class="linkBtn" @click="onTransfer">转账</div> -->
        <!-- <div class="linkBtn" @click="flashExchange">闪兑</div> -->
        <van-button v-if="$attrs.token == 'USDT'" class="button" type="primary" round @click="onRecharge"
          >{{ $t('button.charge') }}</van-button
        >
      </div>
    </div>
    <div class="bottom">
      <span class="label">{{ $t('home.canUse') }}</span>
      <span class="amount">{{ $attrs.balance }}</span>
      <span class="label">{{ $t('home.cantUse') }}</span>
      <span class="amount">{{ $attrs.frozen }}</span>
    </div>
  </div>
</template>
<script setup>
import TPUicon from '@/assets/images/TPU.png'
import TPUAicon from '@/assets/images/TPUA.png'
import USDTicon from '@/assets/images/USDT.png'
import { useI18n } from 'vue-i18n'
const { t : $t } = useI18n()
const icons = {
  TPU: TPUicon,
  TPUA: TPUAicon,
  USDT: USDTicon,
}


const props = defineProps({
  info: {
    type: Object,
    default: () => {
      return {};
    },
  },
  onRecharge: {
    type: Function,
    default: () => {}
  },
  onTransfer: {
    type: Function,
    default: () => {}
  },
  flashExchange: {
    type: Function,
    default: () => {}
  },
  onWithdraw: {
    type: Function,
    default: () => {}
  },
});
</script>
<style lang="scss" scoped>
      .item {
        border: 1px solid var(--van-primary-color);
        padding: 1rem;
        border-radius: var(--van-dialog-radius);
        margin-bottom: 0.6rem;
        
        .top {
          display: flex;
          font-weight: 600;
          font-size: 0.8rem;
          color: #B8B8B8;
          line-height: 1.4rem;
          width: 100%;
          align-items: center;
          
          .icon {
            width: 1.4rem;
            height: 1.4rem;
            margin-right: 6px;
          }
          
          .operate {
            margin-left: auto;
            display: flex;
            align-items: center;

            .linkBtn {
              color: #666666;
              margin-right: 0.6rem;
            }
            .button {
              height: 1.53rem;
            }
          }
        }
        .bottom {
          padding-left: 1.8rem;
          margin-top: 0.8rem;
          font-weight: 400;
          font-size: 0.8rem;
          line-height: 1.2rem;

          .label {
            color: #666666;
            margin-right: 1rem;
          }
          .amount {
            color: #FFFFFF;
            margin-right: 4rem;
          }
        }
      }

</style>