<template>
  <div class="flex items-center justify-between border-b border-gray-300">
    <h1 class="text-lg font-medium">Filter Genre</h1>
    <button @click="modalStore.closeModal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-x-lg"
        viewBox="0 0 16 16"
      >
        <path
          d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
        />
      </svg>
    </button>
  </div>
  <div class="overflow-x-hidden overflow-y-auto grid grid-cols-2 flex-1">
    <div v-for="genre in genres" :key="genre.mal_id">
      <input
        type="checkbox"
        :id="genre.mal_id.toString()"
        :value="genre.mal_id"
        :checked="isGenreSelected(genre.mal_id)"
        @change="searchStore.updateSelectedGenre(genre)"
      />
      <label :for="genre.mal_id.toString()">{{ genre.name }}</label>
    </div>
  </div>
  <div class="border-t border-gray-300 pt-3">
    <MyButton
      text="submit"
      type="filled"
      class="ml-auto"
      @click="clickHandler"
    />
  </div>
</template>

<script setup lang="ts">
import type { ListData } from "~/types/list";
import type { Genre } from "~/types/anime";

const config = useRuntimeConfig();
const modalStore = useModalStore();
const searchStore = useSearchStore();
const router = useRouter();
const { genres, selectedGenres } = storeToRefs(searchStore);
const { data, execute } = useFetch<ListData<Genre>>(
  `${config.public.apiBase}/genres/anime`,
  {
    immediate: false,
  }
);
const isGenreSelected = (id: number) =>
  selectedGenres.value.findIndex((item) => item === id) != -1;

onMounted(async () => {
  if (genres.value.length === 0) {
    await execute();
    if (data.value) {
      searchStore.setGenres(data.value.data);
    }
  }
});

const clickHandler = () => {
  searchStore.setQuery("");
  router.push({
    path: "/anime",
    query: { selectedGenres: selectedGenres.value.join(","), page: 1 },
  });
};
</script>

<style scoped></style>
