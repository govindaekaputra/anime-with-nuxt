<template>
  <header
    class="p-3 border-b border-gray-300 sticky top-0 bg-white w-full flex items-center gap-3"
  >
    <div class="flex-1">
      <NuxtLink to="/" class="text-lg md:text-2xl font-semibold"
        >Anime</NuxtLink
      >
    </div>
    <form
      v-if="!isDetailPage"
      :class="['relative', { ' w-9/12 md:w-1/2': showRecommendations }]"
      @submit.prevent="searchAnime"
    >
      <div
        class="flex items-center border border-gray-300 rounded-xl gap-3 p-3"
      >
        <input
          ref="inputElement"
          type="text"
          v-model="query"
          placeholder="search here"
          class="rounded-xl focus:outline-none flex-1 py-1"
          @focus="setShowRecommendations(true)"
        />
        <button
          class="bg-gray-200 rounded-xl p-3 text-xs hover:scale-105"
          @click="setShowRecommendations(false)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
            />
          </svg>
        </button>
      </div>
      <div
        ref="recommendationsElement"
        :class="[
          { hidden: !showRecommendations },
          'absolute bottom-[-305px] right-0 h-[300px] overflow-x-hidden overflow-y-auto w-full bg-white p-3 shadow-xl shadow-gray-500 border border-gray-300 rounded-xl',
        ]"
      >
        <p v-if="isFetchingRecommendations" class="text-center">Loading...</p>
        <template v-else>
          <NuxtLink
            v-for="anime in recommendations?.data"
            :key="anime.mal_id"
            :to="{ path: `/anime/${anime.mal_id}` }"
            class="flex items-center gap-3 border-b border-gray-300 py-3"
          >
            <NuxtImg
              :src="anime.images['webp'].small_image_url"
              :alt="anime.title"
              width="30"
              height="30"
              class="rounded-full"
            />
            <h2 class="line-clamp-1">{{ anime.title }}</h2>
          </NuxtLink>
          <NuxtLink
            v-if="recommendations?.pagination.has_next_page"
            :to="{ path: '/anime', query: { query } }"
            class="underline text-center block"
            >See more</NuxtLink
          >
        </template>
      </div>
    </form>
    <button v-if="!isDetailPage" @click="showModalFilter">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        class="bi bi-funnel"
        viewBox="0 0 16 16"
      >
        <path
          d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"
        />
      </svg>
    </button>
  </header>
</template>

<script setup lang="ts">
import { useModalStore } from "~/stores/useModalStore";
import { useSearchStore } from "~/stores/useSearchStore";
import type { Anime } from "~/types/anime";
import type { ListPagination } from "~/types/list";
import { ModalType } from "~/types/modal_type";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const inputElement = ref<HTMLInputElement | null>(null);
const recommendationsElement = ref<HTMLDivElement | null>(null);
const showRecommendations = ref(false);
const setShowRecommendations = (val: boolean) => {
  showRecommendations.value = val;
};
const searchStore = useSearchStore();
const { query } = storeToRefs(searchStore);
const recommendations = ref<ListPagination<Anime> | null>(null);
const isFetchingRecommendations = ref(false);
const isDetailPage = computed(
  () =>
    route.path.includes("/anime") && route.params?.id?.toString() != undefined
);

const debouncedRequest = useDebounceFn(async (searchQuery: string) => {
  try {
    const url = `${config.public.apiBase}/anime`;
    const { data } = await useAsyncData<ListPagination<Anime>>(url, () =>
      $fetch(url, {
        query: { q: searchQuery },
      })
    );
    if (data.value) {
      recommendations.value = data.value;
    }
  } catch (error) {
    recommendations.value = null;
  } finally {
    isFetchingRecommendations.value = false;
  }
}, 1000);

watch(query, (newValue, oldValue) => {
  isFetchingRecommendations.value = true;
  debouncedRequest(newValue);
});

const showModalFilter = () => {
  modalStore.showModal({ type: ModalType.filter });
};

const searchAnime = () => {
  searchStore.setSelectedGenres([]);
  router.push({
    path: "/anime",
    query: { query: query.value, page: 1 },
    force: true,
  });
};

const windowClickHandler = (e: MouseEvent) => {
  const element = e.target as HTMLElement;
  if (
    !recommendationsElement.value?.isSameNode(element) &&
    !inputElement.value?.isSameNode(element)
  ) {
    showRecommendations.value = false;
  }
};
onMounted(() => {
  window.addEventListener("click", windowClickHandler);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", windowClickHandler);
});
</script>

<style scoped></style>
