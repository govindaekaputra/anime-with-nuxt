<template>
  <h1 v-if="pending" class="text-center text-2xl">Loading...</h1>
  <template v-else>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
      <div v-for="anime in topAnime?.data" :key="anime.mal_id">
        <AnimeCard :anime="anime" />
      </div>
    </div>
    <vue-awesome-paginate
      :total-items="topAnime?.pagination.items.total"
      :items-per-page="topAnime?.pagination.items.per_page"
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

useSeoMeta({ title: "Top anime", description: "Top anime of all time" });

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const topAnime = ref<ListPagination<Anime> | null>(null);
const page = ref(parseInt(route.query.page?.toString() || "1"));
const pending = ref(true);
const request = async (page: number) => {
  try {
    pending.value = true;
    const url = `${config.public.apiBase}/top/anime`;
    const { data: response } = await useAsyncData<ListPagination<Anime>>(
      url,
      () =>
        $fetch(url, {
          query: { page },
        })
    );
    if (response.value) {
      topAnime.value = response.value;
    }
  } catch (error) {
    topAnime.value = null;
  } finally {
    pending.value = false;
  }
};
const onClickHandler = (value: number) => {
  router.push({
    path: "/",
    query: {
      page: value,
    },
    force: true,
  });
};

watch(
  () => route.query,
  (newValue, oldValue) => {
    page.value = parseInt(newValue.page?.toString() || "1");
  }
);

watchEffect(async () => {
  request(page.value);
});
</script>

<style scoped></style>
