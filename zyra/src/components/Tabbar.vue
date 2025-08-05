<template>
  <div class="tabbar">
    <div class="item" @click="() => toPage('/')">
      <img class="icon" src="@/assets/images/home.svg" />
      <!-- {{ $t('home.home') }} -->
    </div>
    <div class="item" @click="() => toPage('/deal')">
      <img class="icon" src="@/assets/images/deal.svg" />
      <!-- {{ $t('home.deal') }} -->
    </div>
    <div class="item middle" @click="() => toPage('/mining')">
      <img class="middleIcon" src="@/assets/images/cube.png" />
    </div>
    <div class="item" @click="() => toPage('/assets')">
      <img class="icon" src="@/assets/images/assets.svg" />
      <!-- {{ $t('home.assets') }} -->
    </div>
    <div class="item" @click="() => toPage('/my')">
      <img class="icon" src="@/assets/images/my.svg" />
      <!-- {{ $t('home.my') }} -->
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useI18n } from 'vue-i18n'


const { t : $t } = useI18n()

const props = defineProps({
  nowUrl: {
    type: String,
    default: '',
  }
})

const router = useRouter();

const toPage = (path) => {
  if(/deal|mining|my/.test(path)) {
    showToast($t('tips.notOpen'))
    return
  }
  if(props.nowUrl != path) 
    router.replace({ path });
  
};
</script>
<style lang="scss" scoped>
.tabbar {
  display: flex;
  height: 5.13rem;
  background-color: #1B1D42;
  border-radius: 19px;
  width: 93vw;
  color: #b8b8b8;
  align-items: center;
  left: 3.5vw;
  position: fixed;
  bottom: 1.2rem;
  // position: relative;
  z-index: 5;

  .item {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    // color: #cdbdbd;
    // font-size: 0.8rem;
    line-height:100%;

    .icon {
      width: 1.8rem;
      display: block;
      // margin-bottom: 0.25rem;
    }
  }

  .middle {
    min-width: 4rem;
    max-width: 4rem;
    height: 4rem;
    border-radius: 50%;
    // background-color: #def34b;
    display: flex;
    align-items: center;
    justify-content: center;

    .middleIcon {
      width: 3.6rem;
      height: 3.6rem;
    }
  }
}
</style>