<template>
  <van-popup
    :show="visible"
    class="popupContent"
    position="bottom"
    @close="onClose">
      <img @click="onClose" class="close" src="@/assets/images/closeBtn.png" />
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
    background-color: #222222;
    padding: 1.6rem;

    .close {
      position: absolute;
      top: 1.6rem;
      right: 1.6rem;
    }
  }
</style>