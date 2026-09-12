import {
  getAnimeInfo,
  getEpisode,
  getLatest,
  searchAnime,
  searchAnimesByFilter,
  searchAnimesByURL
} from "animeav1-scraper";

const working = {
  getAnimeInfo: (await getAnimeInfo("one-piece"))?.title !== undefined,
  getEpisode: (await getEpisode("one-piece", 1))?.title !== undefined,
  searchAnime: Boolean((await searchAnime("isekai", 2))?.media?.length || 0 > 0),
  searchAnimesByFilter: Boolean((await searchAnimesByFilter({
    genres: ["Romance"],
    statuses: ["En emisión"],
    categories: ["TV Anime", "OVA"],
    order: "Predeterminado",
    page: 1
  }))?.media?.length || 0 > 0),
  searchAnimesByURL: Boolean((await searchAnimesByURL("https://animeav1.com/catalogo?search=isekai&page=2"))?.media?.length || 0 > 0),
  getLatest: Boolean((await getLatest())?.length || 0 > 0)
};

console.info(working);
