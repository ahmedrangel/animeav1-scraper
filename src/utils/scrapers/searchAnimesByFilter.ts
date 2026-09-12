import { AnimeGenreEnum, AnimeStatusEnum, AnimeTypeEnum, FilterOrderEnum, callAnimeA1 } from "../helpers";
import type { AnimeGenre, AnimeType, FilterOptions, FilterOrderType, SearchAnimeResults } from "../../types";
import { executeSearch } from "./executeSearch";

/** * Realiza una búsqueda usando filtros específicos.
 * @param {FilterOptions} [options] - Opciones de filtro para la búsqueda
 * @param {AnimeGenre[]} [options.genres] - Géneros de anime
 * @param {AnimeType[]} [options.types] - Categorías de anime
 * @param {AnimeStatus[]} [options.statuses] - Estados de anime
 * @param {FilterOrderType} [options.order] - El orden (por defecto "Predeterminado")
 * @param {number} [options.page] - El número de página (por defecto 1)
 * @param {number} [options.maxYear] - El año máximo de lanzamiento para filtrar los animés
 * @param {number} [options.minYear] - El año mínimo de lanzamiento para filtrar los animés
 * @returns {Promise<SearchAnimeResults | null>}
 * @example await searchAnimesByFilter({ genres: ["Acción"], statuses: ["En emisión"], types: ["TV Anime", "OVA"], order: "Predeterminado", page: 1 })
 */
export const searchAnimesByFilter = async (options?: FilterOptions): Promise<SearchAnimeResults | null> => {
  try {
    const genres = options?.genres?.map((genre) => {
      return AnimeGenreEnum[genre as keyof typeof AnimeGenreEnum] || genre;
    }) || [];

    const statuses = options?.statuses?.map((status) => {
      return AnimeStatusEnum[status as keyof typeof AnimeStatusEnum] || status;
    }) || [];

    const types = options?.types?.map((type) => {
      return AnimeTypeEnum[type as keyof typeof AnimeTypeEnum] || type;
    }) || [];

    const order = options?.order ? FilterOrderEnum[options.order as unknown as keyof typeof FilterOrderEnum] : "default";

    const filterData = await callAnimeA1("/catalogo", {
      query: {
        ...genres && Array.isArray(genres) ? { genre: genres } : {},
        ...statuses && Array.isArray(statuses) ? { status: statuses } : {},
        ...types && Array.isArray(types) ? { category: types } : {},
        order: order,
        ...options?.page ? { page: options.page } : {},
        ...options?.maxYear ? { maxYear: options.maxYear } : {},
        ...options?.minYear ? { minYear: options.minYear } : {}
      }
    });
    if (!filterData) return null;

    return executeSearch(filterData);
  }
  catch {
    return null;
  }
};
