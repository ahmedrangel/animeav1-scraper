import type { AnimeGenres, AnimeStatuses, AnimeTypes, FilterOrderTypes } from "./utils/helpers";

export type AnimeStatus = typeof AnimeStatuses[number];
export type AnimeType = typeof AnimeTypes[number];
export type AnimeGenre = typeof AnimeGenres[number];
export type FilterOrderType = typeof FilterOrderTypes[number];

export interface PartialAnimeData {
/** Título del animé */
  title: string;
  /** URL de la carátula del animé */
  cover: string;
  /** La sinopsis (descripción) del animé */
  synopsis: string;
  /** Slug del animé */
  slug: string;
  /** El tipo de anime: type "OVA" | "ONA" | "TV Anime" | "Película" | "Especial" */
  type: AnimeType;
  /** La URL directa a la página de éste animé */
  url: string;
}

export interface SearchAnimeResults {
/** Página actual */
  currentPage: number;
  /** URL a la página anterior, o null en caso de no haber */
  previousPage: string | null;
  /** URL a la página siguiente, o null en caso de no haber */
  nextPage: string | null;
  /** Indica si hay una página siguiente o no */
  hasNextPage: boolean;
  /** Número de páginas con resultados de la búsqueda realizada */
  foundPages: number;
  /** Los animés encontrados en la búsqueda */
  media: PartialAnimeData[];
}

export interface AnimeInfoData {
/** Titulo del animé */
  title: string;
  /** Slug del animé */
  slug: string;
  /** Array con titulos alternativos de este animé */
  alternative_titles: string[];
  /** Estado de este animé: "En emision" | "Finalizado" | "Proximamente" */
  status?: AnimeStatus;
  /** Evaluación de estrellas de este animé */
  rating: number;
  /** El tipo de anime: "OVA" | "ONA" | "TV Anime" | "Película" | "Especial" */
  type?: AnimeType;
  /** URL a la carátula de este animé */
  cover: string;
  /** Sinopsis o descripción del animé */
  synopsis: string;
  /** Array con los géneros (etiquetas) del anime */
  genres: AnimeGenre[];
  /** Fecha del próximo episodio en emisión (YYYY-MM-DD) */
  next_airing_episode?: string;
  /** Año de lanzamiento del animé */
  year: number;
  /** Fecha de inicio de emisión del animé (YYYY-MM-DD) */
  start_date?: string;
  /** Fecha de finalización de emisión del animé (YYYY-MM-DD) */
  end_date?: string;
  /** ID de MyAnimeList del animé */
  malId: number;
  /** Indica si el anime es para adultos */
  mature: boolean;
  /** URL del tráiler del animé, si existe */
  trailer?: string;
  /** Número de votos que ha recibido el animé */
  votes: number;
  /** Lista de animés relacionados */
  related?: AnimeRelated[];
  /** Número de episodios que tiene este animé */
  episodes: EpisodeData[] | number;
  /** La URL directa a la pagina del animé */
  url: string;
}

/** Relación de animés (Secuela, Resumen, Otro, etc.) */
export interface AnimeRelated {
/** Título del animé relacionado */
  title: string;
  /** Tipo de relación (Precuela, Secuela, etc.) */
  relation?: string;
  /** El slug de este animé */
  slug: string;
  /** URL de la carátula del anime relacionado */
  cover: string;
  /** Año de lanzamiento del anime relacionado */
  year: number;
  /** Fecha de inicio de emisión del anime relacionado (YYYY-MM-DD) */
  start_date?: string;
  /** URL completa al anime relacionado */
  url: string;
}

export interface EpisodeData {
/** Número del episodio */
  number: number;
  /** Slug del episodio */
  slug: string;
  /** Link del episodio */
  url: string;
}

export interface ChapterData {
/** Título del episodio */
  title: string;
  /** Número del episodio */
  number: number;
  /** URL del thumbnail de este episodio */
  cover: string;
  /** Slug del episodio */
  slug: string;
  /** URL directa del episodio */
  url: string;
}

export interface FilterOptions {
/** Lista de generos para la búsqueda */
  genres?: AnimeGenre[];
  /** Lista de tipos para la búsqueda */
  types?: AnimeType[];
  /** Los statuses de los animés para filtrar */
  statuses?: AnimeStatus[];
  /** El orden en el que se recibirán los animés */
  order?: FilterOrderType;
  /** El número de página que se solicitará */
  page?: number;
  /** El año máximo de lanzamiento para filtrar los animés */
  maxYear?: number;
  /** El año mínimo de lanzamiento para filtrar los animés */
  minYear?: number;
}

export interface EpisodeServersData {
/** Nombre del servidor */
  name: string;
  /** URL del servidor */
  url: string;
  /** Tipo de servidor (SUB o DUB) */
  type: "SUB" | "DUB";
}

export interface EpisodeInfoData {
  title: string;
  number: number;
  embeds: EpisodeServersData[];
  downloads: EpisodeServersData[];
}

export interface SvelteMedia {
  media: {
    id: number;
    categoryId: number;
    title: string;
    aka: Record<string, string>;
    genres: {
      id: number;
      name: string;
      type: number;
      slug: string;
      malId: number;
    }[];
    synopsis: string;
    poster: string | null;
    backdrop: string | null;
    trailer: string | null;
    status: number;
    runtime: null;
    startDate?: string;
    nextDate?: string;
    endDate?: string;
    waitDays: number;
    featured: boolean;
    mature: boolean;
    episodesCount: number;
    score: number;
    votes: number;
    slug: string;
    malId: number;
    seasons: unknown;
    createdAt: string;
    updatedAt: string;
    category: { id: number, name: AnimeType, slug: string, malId: string };
    episodes: {
      id: number;
      number: number;
    }[];
    relations: { type: number, destination: { id: number, title: string, slug: string, startDate: string } }[];
  };
  embeds?: SvelteServersData;
  downloads?: SvelteServersData;
}

interface SvelteServersData {
  SUB?: { server: string, url: string }[];
  DUB?: { server: string, url: string }[];
}