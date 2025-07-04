<template>
  <div class="tabbar">
    <div class="item" @click="() => toPage('/')">
      <img class="icon" src="@/assets/images/home.svg" />
      {{ $t('home.home') }}
    </div>
    <div class="item" @click="() => toPage('/deal')">
      <img class="icon" src="@/assets/images/deal.svg" />
      {{ $t('home.deal') }}
    </div>
    <div class="item middle" @click="() => toPage('/mining')">
      <img class="middleIcon" src="@/assets/images/cube.svg" />
    </div>
    <div class="item" @click="() => toPage('/assets')">
      <img class="icon" src="@/assets/images/assets.svg" />
      {{ $t('home.assets') }}
    </div>
    <div class="item" @click="() => toPage('/my')">
      <img class="icon" src="@/assets/images/my.svg" />
      {{ $t('home.my') }}
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
  height: 3.5rem;
  background-color: #333333;
  border-radius: 3.5rem;
  width: 93vw;
  color: #b8b8b8;
  align-items: flex-end;
  left: 3.5vw;
  position: fixed;
  bottom: 1.2rem;

  .item {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    color: #cdbdbd;
    font-size: 0.8rem;

    .icon {
      width: 1.5rem;
      margin-bottom: 0.2rem;
    }
  }

  .middle {
    min-width: 4rem;
    max-width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: #def34b;
    display: flex;
    align-items: center;
    justify-content: center;

    .middleIcon {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>