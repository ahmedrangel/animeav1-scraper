import { $fetch, type FetchOptions } from "ofetch";
import type { CheerioAPI } from "cheerio";
import type { SvelteMedia } from "../types";

export const animeav1URL = "https://animeav1.com";

export const callAnimeA1 = async (path: string = "", options?: FetchOptions<any>): Promise<string | null> => {
  return $fetch<string>(`${animeav1URL}${path}`, options).catch(() => null);
};

const getEnum = (array: readonly string[]) => {
  return Object.fromEntries(
    array.map(item => [item, item.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[^\w-]+/g, "")])
  );
};

export const AnimeGenres = ["Acción", "Aventura", "Ciencia Ficción", "Comedia", "Deportes", "Drama", "Fantasía", "Misterio", "Recuentos de la Vida", "Romance", "Seinen", "Shoujo", "Shounen", "Sobrenatural", "Suspenso", "Terror", "Antropomórfico", "Artes Marciales", "Carreras", "Detectives", "Ecchi", "Elenco Adulto", "Escolares", "Espacial", "Gore", "Gourmet", "Harem", "Histórico", "Idols (Hombre)", "Idols (Mujer)", "Infantil", "Isekai", "Josei", "Juegos Estrategia", "Mahou Shoujo", "Mecha", "Militar", "Mitología", "Música", "Parodia", "Psicológico", "Samurai", "Shoujo Ai", "Shounen Ai", "Superpoderes", "Vampiros"] as const;

export const AnimeStatuses = ["En emisión", "Finalizado", "Próximamente"] as const;
export const AnimeTypes = ["OVA", "ONA", "TV Anime", "Película", "Especial"] as const;
export const FilterOrderTypes = ["Predeterminado", "Puntuación", "Populares", "Título", "Últimos Agregados", "Últimos Estrenos"] as const;

export const FilterOrderEnum = {
  "Predeterminado": "default",
  "Puntuación": "score",
  "Populares": "popular",
  "Título": "title",
  "Últimos Agregados": "latest_added",
  "Últimos Estrenos": "latest_released"
};

export const AnimeTypeEnum = getEnum(AnimeTypes);

export const AnimeStatusEnum = {
  "En emisión": "emision",
  "Finalizado": "finalizado",
  "Próximamente": "proximamente"
};

export const AnimeGenreEnum = getEnum(AnimeGenres);

export const getSvelteData = ($: CheerioAPI) => {
  const script = $("script").map((_, el) => $(el).html()).get().find(script => script?.includes("data:{media:"));
  if (!script) return null;
  const marker = "data:{media:";
  const markerIndex = script.indexOf(marker);
  if (markerIndex === -1) return null;
  const objectStart = script.indexOf("{", markerIndex + "data:".length);
  const data = script.slice(objectStart, script.indexOf("},uses:", objectStart) + 1)?.replace(/\bvoid\s+0\b/g, "null")?.replace(/([{,])(\w+):/g, "$1\"$2\":");
  if (!data) return null;
  return JSON.parse(data) as SvelteMedia;
};