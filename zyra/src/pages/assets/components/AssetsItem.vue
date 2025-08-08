<template>
  <div class="item">
    <div class="top">
      <img class="icon" :src="icons[$attrs.token]" alt="" />
      <p><b>{{ $attrs.token }}</b></p>
      <div class="operate">
        <!-- <div v-if="$attrs.token == 'USDT'" class="linkBtn" @click="onWithdraw">{{ $t('button.withdraw') }}</div> -->
        <!-- <div class="linkBtn" @click="onTransfer">转账</div> -->
        <!-- <div class="linkBtn" @click="flashExchange">闪兑</div> -->
        <van-button v-if="$attrs.token == 'USDT'" :loading="loading" class="button withdrawBtn" @click="onWithdraw"
          >{{ $t('button.withdraw') }}</van-button
        >
        <van-button v-if="$attrs.token == 'USDT'" :loading="loading" class="button" type="primary" @click="onRecharge"
          >{{ $t('button.charge') }}</van-button
        >
      </div>
    </div>
    <div class="bottom">
      <div class="bottomItem">
        <span class="label">{{ $t('home.canUse') }}</span>
        <span class="amount">{{ $attrs.balance }}</span>
      </div>
      <div class="bottomItem">
        <span class="label">{{ $t('home.cantUse') }}</span>
        <span class="amount">{{ $attrs.frozen }}</span>

      </div>
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
  loading: {
    type: Boolean,
    default: false
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
        padding: 1.2rem 1rem;
        background: #131C34;
        border-radius: var(--van-dialog-radius);
        margin-bottom: 0.6rem;
        
        .top {
          display: flex;
          font-weight: 600;
          font-size: 1.13rem;
          color: #8F9CC9;
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
              color: #999999;
              margin-right: 0.6rem;
            }
            .button {
              border-radius: 4px;
              height: 1.4rem;
              font-size: 0.66rem;
              color: #BDC6DC;
              border: none;
            }
            .withdrawBtn {
              margin-right: 6px;
              background-color: #4543A9;
              color: #BDC6DC;
            }
          }
        }
        .bottom {
          padding-left: 1.8rem;
          margin-top: 0.8rem;
          font-weight: 400;
          font-size: 0.8rem;
          line-height: 1.2rem;
          display: flex;
          flex-wrap: wrap;

          .bottomItem {
            flex: 1;
            // min-height: 50%;
            display: flex;
            flex-direction: column;
            font-size: 0.8rem;
            line-height: 0.9rem;
            // text-align: center;

            .label {
              color: #7C84A1;
              white-space: nowrap;
              // margin-right: 1rem;
            }
            .amount {
              color: #FFFFFF;
              white-space: nowrap;
              margin-top: 5px;
              // margin-right: 4rem;
            }
          }

        }
      }

</style>