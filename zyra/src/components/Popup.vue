<template>
  <van-popup
    :show="visible"
    class="popupContent"
    position="bottom"
    @close="onClose">
      <img @click="onClose" class="close" src="@/assets/images/closePopup.png" />
      <slot />
    </van-popup>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  onClose: {
    type: Function,
    default: () => {}
  }
}) 

</script>
<style lang="scss" scoped>
  .popupContent {
    background-color: #131937;
    padding: 1.6rem;
    border-top-left-radius: 23px;
    border-top-right-radius: 23px;

    .close {
      position: absolute;
      top: 1.6rem;
      right: 1.6rem;
      width: 1.53rem;
      height: 1.53rem;
    }
  }
</style>