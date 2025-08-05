<template>
  <van-dialog v-bind="$attrs">
    <template #default>
      <div class="modalContent">
        <img v-if="!$attrs.hideClose" @click="$attrs.onClose" class="close" src="@/assets/images/closeBtn.png" />
        <slot />
      </div>
    </template>
    <template #footer />
  </van-dialog>
</template>
<script setup>

</script>
<style lang="scss" scoped>
  .modalContent {
    padding: 2rem;
    // background-color: #202020;
    font-weight: 600;
    font-size: 0.8rem;
    color: #B8B8B8;
    position: relative;

    .close {
      position: absolute;
      width: 1rem;
      height: 1rem;
      right: 1rem;
      top: 1rem;
    }
  }
</style>