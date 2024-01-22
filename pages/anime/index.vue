<template>
  <h1 v-if="pending" class="text-center text-2xl">Loading...</h1>
  <template v-else>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
      <div v-for="anime in data?.data" :key="anime.mal_id">
        <AnimeCard :anime="anime" />
      </div>
    </div>
    <vue-awesome-paginate
      :total-items="data?.pagination.items.total"
      :items-per-page="data?.pagination.items.per_page"
      :max-pages-shown="5"
      v-model="page"
      :on-click="onClickHandler"
    />
  </template>
</template>

<script setup lang="ts">
import type { ListPagination } from "~/types/list";
import type { Anime } from "~/types/anime";
import AnimeCard from "~/components/AnimeCard.vue";

useSeoMeta({
  title: "Anime search",
  description: "Search anime based on genre and title",
});

const config = useRuntimeConfig();
const searchStore = useSearchStore();
const router = useRouter();
const route = useRoute();
const data = ref<ListPagination<Anime> | null>(null);
const page = ref(parseInt(route.query.page?.toString() || "1"));
const pending = ref(true);

const onClickHandler = (value: number) => {
  router.push({
    path: "/anime",
    query: {
      query: route.query.query?.toString(),
      selectedGenres: route.query.selectedGenres?.toString(),
      page: value,
    },
    force: true,
  });
};

const request = async (
  page: number,
  searchQuery?: string,
  selectedGenres?: string
) => {
  try {
    pending.value = true;
    const url = `${config.public.apiBase}/anime`;
    const { data: response } = await useAsyncData<ListPagination<Anime>>(
      url,
      () =>
        $fetch(url, {
          query: { page, q: searchQuery, genres: selectedGenres },
        })
    );
    if (response.value) {
      data.value = response.value;
    }
  } catch (error) {
    data.value = null;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  if (route.query.selectedGenres) {
    searchStore.setSelectedGenres(
      route.query.selectedGenres
        ?.toString()
        .split(",")
        .map((item) => parseInt(item))
    );
  }
  if (route.query.query) {
    searchStore.setQuery(route.query.query?.toString());
  }
});

watch(
  () => route.query,
  (newValue, oldValue) => {
    page.value = parseInt(newValue.page?.toString() || "1");
  }
);
watchEffect(async () => {
  request(
    page.value,
    route.query.query?.toString(),
    route.query.selectedGenres?.toString()
  );
});
</script>

<style scoped></style>
