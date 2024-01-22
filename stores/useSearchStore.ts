import { SEARCH_STORE_KEY } from "~/constant";
import type { Genre } from "~/types/anime";

interface State {
  query: string;
  genres: Genre[];
  selectedGenres: number[];
}

export const useSearchStore = defineStore(SEARCH_STORE_KEY, {
  state: () =>
    <State>{
      query: "",
      genres: [],
      selectedGenres: [],
    },
  actions: {
    setQuery(value: string) {
      this.query = value;
    },
    setGenres(value: Genre[]) {
      this.genres = value;
    },
    setSelectedGenres(value: number[]) {
      this.selectedGenres = value;
    },
    updateSelectedGenre(value: Genre) {
      const index = this.selectedGenres.findIndex(
        (item) => item === value.mal_id
      );
      if (index != -1) {
        this.selectedGenres.splice(index, 1);
      } else {
        this.selectedGenres.push(value.mal_id);
      }
    },
  },
});
