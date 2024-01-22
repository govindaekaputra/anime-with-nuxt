<template>
  <Teleport to="body">
    <div
      v-if="isShow"
      @click.self="modalStore.closeModal"
      class="fixed inset-0 bg-black/30 backdrop-blur z-50 flex items-center justify-center md:p-6 cursor-pointer"
    >
      <div
        class="w-full h-full min-w-[300px] md:max-w-[600px] bg-white border border-gray-300 md:rounded-xl p-3 flex flex-col"
      >
        <component :is="component" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from "~/stores/useModalStore";
import ModalFilterVue from "./ModalFilter.vue";
import { ModalType } from "~/types/modal_type";

const modalStore = useModalStore();
const { isShow, type } = storeToRefs(modalStore);
const component = computed(() => {
  switch (type.value) {
    case ModalType.filter:
      return ModalFilterVue;
    default:
      return "<template></template>";
  }
});
</script>

<style scoped></style>
