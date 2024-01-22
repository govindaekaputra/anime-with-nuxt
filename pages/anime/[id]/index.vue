<template>
  <h1 v-if="pending" class="text-center text-2xl">Loading...</h1>
  <template v-else>
    <div class="flex flex-col md:flex-row gap-3 md:h-1/3 max-h-[400px]">
      <NuxtImg
        width="300"
        height="300"
        class="w-full md:w-1/3 h-full object-cover"
        :src="anime?.images['webp'].large_image_url"
        :alt="anime?.title"
      />
      <div class="flex flex-col gap-3 flex-1">
        <h1 class="text-3xl font-medium">{{ anime?.title }}</h1>
        <p>{{ anime?.synopsis }}</p>
        <div class="flex gap-3 flex-wrap">
          <div
            v-for="genre in anime?.genres"
            :key="genre.mal_id"
            class="bg-gray-200 text-black p-3 text-sm h-fit"
          >
            {{ genre.name }}
          </div>
        </div>
        <table>
          <tr>
            <td>Title Japanese</td>
            <td>{{ anime?.title_japanese ?? "---" }}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{{ anime?.type ?? "---" }}</td>
          </tr>
          <tr>
            <td>Episodes</td>
            <td>{{ anime?.episodes ?? "---" }}</td>
          </tr>
          <tr>
            <td>Score</td>
            <td>{{ anime?.score ?? "---" }}</td>
          </tr>
          <tr>
            <td>Rating</td>
            <td>{{ anime?.rating ?? "---" }}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{{ anime?.status ?? "---" }}</td>
          </tr>
          <tr>
            <td>Season</td>
            <td>{{ anime?.season ?? "---" }}</td>
          </tr>
          <tr>
            <td>Broadcast</td>
            <td>{{ anime?.broadcast.string ?? "---" }}</td>
          </tr>
        </table>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Anime } from "~/types/anime";
interface Param {
  id?: string;
}
const config = useRuntimeConfig();
const route = useRoute();
const { id } = route.params as Param;
if (!id) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
  });
}
const { data, pending } = useFetch<{ data: Anime }>(
  `${config.public.apiBase}/anime/${id}`
);
const anime = computed(() => data.value?.data);

useSeoMeta({
  title: () => anime.value?.title ?? "",
  description: () => anime?.value?.synopsis ?? "",
});
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
