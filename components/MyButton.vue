<template>
  <button :class="classObj" @click="$emit('click')">
    {{ $props.text }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  type: "outline" | "filled";
}
const { type } = defineProps<Props>();
defineEmits(["click"]);
const classObj = computed(() => ({
  "text-sm rounded-full p-3 block border border-gray-300 min-w-[100px] active:bg-gray-200":
    true,
  "bg-black text-white hover:bg-white hover:text-black": type === "filled",
  "bg-tranparent text-black hover:bg-black hover:text-white active:text-black":
    type === "outline",
}));
</script>

<style scoped></style>
