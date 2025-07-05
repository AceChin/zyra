<template>
  <div :class="['content', visible || 'show']">
    <div v-if="visible" @click="close" class="mask"></div>
    <div :class="['layout', !visible || 'inout']">
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
      <!-- <div class="cell">
        {{ $t('home.whitePaper') }}
        <div class="cellRight">
          <img class="arrow" src="@/assets/images/rightArrow-e0f.svg" />
        </div>
      </div> -->
      <div class="advertising" @click="() => toPage('/node')">
        {{ $t('home.buyNodeTips') }}
        <p class="joinBtn">{{ $t('home.nowJoin') }}>>></p>
      </div>

      <van-button
        class="button"
        plain
        type="primary"
        @click="logout">{{ $t('home.exit') }}</van-button>
    </div>
    <Confirm ref="confirm" />
    <Language :visible="languageVisible" :onClose="() => languageVisible = false" />
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
import Language from './Language.vue';

// const { locale } = useI18n()
const { locale, t : $t } = useI18n()


const router = useRouter();
const web3Store = useWeb3Store()
const visible = ref(false);
const languageVisible = ref(false);
const confirm = ref(null)

const open = () => {
  visible.value = true;
};

const changeLangue = () => {
  languageVisible.value = true
}

const close = () => {
  visible.value = false;
}

const logout = async () => {
  await confirm.value.open('确定要退出吗')
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
  z-index: 2;
  
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
    width: 18.2rem;
    left: -18.2rem;
    background-color: #222222;
    padding: 1rem;
    height: 100vh;
    position: absolute;
    top: 0;
    transition: left 0.5s;
    display: flex;
    flex-direction: column;
    // box-shadow:0rem 0rem 1rem rgba(224,246,75,0.2);

    .top {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      .avatar {
        width: 2rem;
        height: 2rem;
        background-color: aliceblue;
        margin-right: 0.5rem;
      }

      .userInfo {
        display: flex;
        flex-direction: column;

        .address {
          color: #e0f64b;
          font-size: 1.1rem;
          line-height: 1.4rem;
        }
        .name {
          font-size: 0.8rem;
          line-height: 1rem;
          color: #b8b8b8;
          margin-top: 0.2rem;
        }
      }
      .close {
        width: 1.1rem;
        height: 1.1rem;
        margin-left: auto;
      }
    }

    .cell {
      background: #000000;
      border-radius: 0.5rem;
      padding: 0.8rem;
      color: #CCCCCC;
      font-size: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.2rem;

      .cellRight {
        margin-left: auto;

        .arrow {
          width: 1.2rem;
          vertical-align: middle;
        }
      }
    }
    .advertising {
      width: 16rem;
      min-height: 7.3rem;
      background: #E0F64B;
      border-radius: var(--van-dialog-radius);
      margin-top: 7.6rem;
      font-size: 1.4rem;
      color: #000000;
      line-height: 1.85rem;
      font-weight: bold;
      padding: 1.2rem 1.6rem;
      
      .joinBtn {
        font-size: 1rem;
        margin-top: 1rem;
      }
    }
  }
  .inout {
    left: 0;
  }
  .button {
    width: 100%;
    margin-top: auto;
  }
}
</style>