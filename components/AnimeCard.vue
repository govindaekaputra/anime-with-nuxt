<template>
  <div
    class="border border-gray-300 rounded-xl p-3 bg-white w-full h-full flex flex-col gap-3"
  >
    <NuxtImg
      :src="anime.images['webp'].large_image_url"
      :alt="anime.title"
      format="webp"
      class="w-full h-[300px] object-cover rounded-tl-xl rounded-tr-xl"
      width="300"
      height="300"
    />
    <h2 class="text-lg font-medium line-clamp-1">{{ anime.title }}</h2>
    <p class="line-clamp-2 text-gray-600">{{ anime.synopsis }}</p>
    <div class="flex-1 flex gap-3 flex-wrap">
      <div
        v-for="genre in anime.genres"
        :key="genre.mal_id"
        class="bg-gray-200 text-black p-3 text-sm h-fit"
      >
        {{ genre.name }}
      </div>
    </div>
    <MyButton text="see more" type="filled" @click="goToDetail" />
  </div>
</template>

<script setup lang="ts">
import type { Anime } from "~/types/anime";
const { anime } = defineProps<{ anime: Anime }>();
const router = useRouter();
const goToDetail = () => {
  router.push(`/anime/${anime.mal_id}`);
};
</script>

<style scoped></style>
