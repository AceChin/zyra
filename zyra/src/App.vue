<script setup>
import { useWeb3Store, useAssetsStore } from "@/stores";
import "vant/lib/toast/style";
import { useI18n } from "vue-i18n";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import zhCN from "vant/es/locale/lang/zh-CN";

const vantLanguage = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

const { locale } = useI18n();
const web3Store = useWeb3Store();
const assetsStore = useAssetsStore();

const language = window.localStorage.getItem("language") || "en-US";
locale.value = language == "zh-CN" ? "zh-CN" : "en-US";
Locale.use(locale.value, vantLanguage[locale.value]);
console.log(locale.value);
web3Store.connectToBSC();
if (sessionStorage.getItem("accessToken")) {
  web3Store.fetchUserInfo();
  assetsStore.fetchAssetsAccounts();
}

const searchParams = new URLSearchParams(location.search);
const paramsObject = Object.fromEntries(searchParams.entries());
web3Store.setInviteCode(paramsObject.inviteCode);
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
#app {
  background: #171717 url("@/assets/images/bg.jpg") no-repeat center center;
  background-size: 100% 100%;
  min-height: 100vh;
  padding: 0;
}

.page {
  padding-top: env(safe-area-inset-top);
}

.van-icon-arrow-left {
  font-size: 1.2rem;
}

:root {
  --van-primary-color: #e0f64b;
  --van-button-primary-background: linear-gradient( 180deg, #612DFB 0%, #8E5EEC 100%);;
  --van-nav-bar-title-text-color: #e0f64b;
  --van-button-mini-height: 3rem;
  // --van-primary-color: transparent;
  --van-button-plain-background: transparent;
  --van-nav-bar-background: #171717;
  --van-background-2: #21335A;
  --van-picker-mask-color: #171717;
  --van-button-default-border-color: #21335A;
  --van-button-primary-border-color: #AD8FFF;
  --van-button-default-color: #94A3C6;
  --van-button-default-background: #21335A;
  --van-button-primary-color: #ffffff;
  --van-dialog-radius: 8px;
  --van-dialog-background: #202020;
  --van-toast-text-color: #ffffff;
  --van-popup-background: #202020;
  --van-toast-background: rgba(0, 0, 0, 1);
  --van-toast-default-width: 150px;
  --van-radius-lg: 18px;
  --van-button-radius: 10px;
  --van-text-color: #ffffff;
  --van-overlay-background: rgba(0, 0, 0, 0.8);
}
</style>
