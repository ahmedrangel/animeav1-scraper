import { load } from "cheerio";
import { AnimeStatuses, AnimeTypes, animeav1URL, callAnimeA1, getSvelteData } from "../helpers";
import type { AnimeGenre, AnimeInfoData, AnimeStatus, AnimeType } from "../../types";

/** * Obtiene la información de un anime por su slug
 * @param {string} slug - El slug del anime
 * @returns {Promise<AnimeInfoData | null>}
 * @example await getAnimeInfo("one-piece") // Usando slug del anime
 */
export const getAnimeInfo = async (
  slug: string
): Promise<AnimeInfoData | null> => {
  if (!slug || (typeof slug) !== "string") throw new Error("Slug no válido o no proporcionado");
  try {
    const html = await callAnimeA1(`/media/${slug}`);
    if (!html) return null;

    const $ = load(html);
    const { media } = getSvelteData($)!;

    const info = $("main > article > div > div > header > div > span").map((_, el) => $(el).text()).get();
    const status = info[info.length - 1] as AnimeStatus;
    const year = info?.[2];
    const alternativeTitles = $("main > article > div > div > header > div > h2").map((i, el) => $(el).text()).get();

    const containsRelated = $("main > section").eq(0).find("header > div > h2").text() === "Relacionados";
    const related = containsRelated? $("main > section").eq(0).find("div > div > div > article:has(header > h3)")
      .map((_, el) => {
        const relationSlug = $(el).find("a").attr("href")?.split("/").filter(Boolean).pop() || "";
        return {
          title: $(el).find("header > h3").text().trim(),
          relation: $(el).find("header > span").text().trim(),
          slug: relationSlug,
          cover: $(el).find("figure > img").attr("src") || "",
          year: parseInt($(el).parent().find("div > div").first().text().trim()),
          startDate: media.relations?.find((r: Record<string, any>) => r?.destination?.slug === relationSlug)?.destination?.startDate,
          url: animeav1URL + $(el).find("a").attr("href") || ""
        };
      })
      .get(): [];

    const animeInfo: AnimeInfoData = {
      title: media.title,
      slug: media.slug,
      alternative_titles: alternativeTitles,
      status: AnimeStatuses.includes(status) ? status : undefined,
      rating: media.score,
      type: media?.category?.name && AnimeTypes.includes(media?.category?.name) ? media.category.name : undefined,
      cover: $("main > article > div > div> figure > img").attr("src") as string,
      synopsis: media.synopsis,
      genres: media?.genres?.map((g: Record<string, any>) => g.name) as AnimeGenre[],
      next_airing_episode: undefined, // Info not given
      year: parseInt(year),
      start_date: media?.startDate,
      end_date: media?.endDate,
      malId: media?.malId,
      mature: media.mature,
      trailer: media.trailer ? `https://www.youtube.com/watch?v=${media.trailer}` : undefined,
      votes: media.votes,
      episodes: [],
      url: `${animeav1URL}/media/${slug}`,
      related
    };

    if (media?.episodes?.length) {
      for (let i = 1; i <= media.episodes.length; i++) {
        if (animeInfo.episodes instanceof Array) {
          animeInfo.episodes.push({
            number: i,
            slug: slug + "-" + i,
            url: `${animeav1URL}/media/${slug}/${i}`
          });
        }
      }
    }

    $("body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > div:nth-child(3) > span").each((i, el) => {
      animeInfo.alternative_titles.push($(el).text());
    });

    return animeInfo;
  }
  catch {
    return null;
  }
};
