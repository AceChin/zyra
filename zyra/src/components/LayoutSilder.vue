<template>
  <div :class="['content', visible || 'show']">
    <div v-if="visible" @click="close" class="mask"></div>
    <div :class="['layout', !visible || 'inout']">
      <img class="layoutBg" src="@/assets/images/layoutBg.png" />
      <div class="layoutContent">
        <div class="top">
          <img class="avatar" src="@/assets/images/head.png" alt="" />
          <div class="userInfo">
            <p class="address">{{ web3Store.accountMask || '' }}</p>
            <p class="name">{{ web3Store.userInfo?.levelName }} {{ web3Store.userInfo?.nodeName?"· "+web3Store.userInfo?.nodeName:""      }}</p>
          </div>
          <img @click="close" class="close" src="@/assets/images/closeBtn.png" />
        </div>
        <div class="cell">
          {{ $t('home.language') }}
          <div class="cellRight" @click="changeLangue">
            {{ $t('home.locale') }}
            <img class="arrow" src="@/assets/images/rightArrow-e0f.svg" />
          </div>
        </div>
        <div class="cell">
          {{ $t('home.whiteBook') }}
          <div class="cellRight" @click="changeLangue">
            <img class="arrow" src="@/assets/images/rightArrow-e0f.svg" />
          </div>
        </div>
        <div class="advertising" @click="() => toPage('/node')">
          {{ $t('home.buyNodeTips') }}
          <p class="joinBtn">{{ $t('home.nowJoin') }}>>></p>
        </div>

        <van-button
          class="button"
          type="primary"
          @click="logout">{{ $t('home.exit') }}</van-button>
      </div>
    </div>
    <Confirm ref="confirm" />
  </div>
</template>
<style lang="scss" scoped>
.avatar{border-radius:1000rem;}
</style>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
import { useWeb3Store } from '@/stores'
import Confirm from './Confirm.vue'
// import Language from './Language.vue';

const props = defineProps({
  onChangeLanguage: {
    type: Function,
    default: () => {}
  }
})

// const { locale } = useI18n()
const { locale, t : $t } = useI18n()


const router = useRouter();
const web3Store = useWeb3Store()
const visible = ref(false);
// const languageVisible = ref(false);
const confirm = ref(null)

const open = () => {
  visible.value = true;
};

const changeLangue = () => {
  // languageVisible.value = true
  props.onChangeLanguage()
}

const close = () => {
  visible.value = false;
}

const logout = async () => {
  await confirm.value.open($t('tips.sureExit'))
  await web3Store.logout()
  visible.value = false
  router.replace('/')
}

const toPage = (path) => {
  router.push({ path });
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.content {
  position: fixed;
  width: 0%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 6;
  
  .mask {
    position: absolute;
    width: 100vw;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba($color: #000000, $alpha: 0.7);
  }
  .show {
    width: 100%;
  }
  .layout {
    width: 19.2rem;
    left: -19.2rem;
    padding: 1rem;
    height: 100vh;
    position: absolute;
    top: 0;
    transition: left 0.5s;

    .layoutBg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    .layoutContent {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
      height: 100%;

      .top {
        display: flex;
        align-items: center;
        margin-bottom: 1.53rem;

        .avatar {
          width: 2.3rem;
          height: 2.3rem;
          margin-right: 0.5rem;
        }

        .userInfo {
          display: flex;
          flex-direction: column;

          .address {
            color: #FFFFFF;
            font-size: 0.85rem;
            line-height: 1.4rem;
          }
          .name {
            font-size: 0.8rem;
            line-height: 0.8rem;
            color: #BAA1FF;
            // margin-top: 0.2rem;
          }
        }
        .close {
          width: 1.1rem;
          height: 1.1rem;
          margin-left: auto;
        }
      }

      .cell {
        background: #4616C7;
        border-radius: 0.5rem;
        padding: 0.8rem;
        color: #CCCCCC;
        font-size: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .cellRight {
          margin-left: auto;
          color: #ffffff;

          .arrow {
            width: 1.2rem;
            vertical-align: middle;
          }
        }
      }
      .advertising {
        width: 100%;
        min-height: 7.3rem;
        background: linear-gradient( 29deg, #3C19B8 0%, #902ED8 100%);
        border-radius: var(--van-dialog-radius);
        margin-top: 1.46rem;
        font-size: 1.4rem;
        color: #ffffff;
        line-height: 1.85rem;
        padding: 1.33rem 1.26rem;
        
        .joinBtn {
          font-size: 1rem;
          margin-top: 1rem;
        }
      }
    }

  }
    .button {
      width: 100%;
      height: 54px;
      margin-top: auto;
      background: #5816C7;
      border: none;
    }
  .inout {
    left: 0;
  }
}
</style>