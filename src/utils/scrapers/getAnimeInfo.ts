import { load } from "cheerio";
import { AnimeStatuses, AnimeTypes, animeav1URL, callAnimeA1 } from "../helpers";
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

    const scripts = $("script");

    const info = $("main > article > div > div > header > div > span").map((_, el) => $(el).text()).get();
    const status = info[info.length - 1] as AnimeStatus;
    const type = info?.[0] as AnimeType;
    const year = info?.[2];
    const alternativeTitles = $("main > article > div > div > header > div > h2").map((i, el) => $(el).text()).get();

    const containsRelated = $("main > section").eq(0).find("header > div > h2").text() === "Relacionados";
    const related = containsRelated? $("main > section").eq(0).find("div > div:has(header > h3)")
      .map((_, el) => ({
        title: $(el).find("header > h3").text().trim(),
        relation: $(el).find("header > span").text().trim(),
        slug: $(el).find("a").attr("href")?.split("/").filter(Boolean).pop() || "",
        url: animeav1URL + $(el).find("a").attr("href") || ""
      }))
      .get(): [];

    const animeInfo: AnimeInfoData = {
      title: $("main > article > div > div > header > div > h1").text(),
      alternative_titles: alternativeTitles,
      status: AnimeStatuses.includes(status) ? status : undefined,
      rating: $("main > article > div > div > div > div.ic-star-solid div.text-lead").text(),
      type: AnimeTypes.includes(type) ? type : undefined,
      cover: $("main > article > div > div> figure > img").attr("src") as string,
      synopsis: $("main > article > div > div > div.entry > p").text(),
      genres: $("main > article > div > div > header > div > a")
        .map((_, el) => $(el).text().trim())
        .get() as AnimeGenre[],
      next_airing_episode: undefined, // Info not given
      year: parseInt(year),
      episodes: [],
      url: `${animeav1URL}/media/${slug}`,
      related
    };

    const episodesFind = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("episodes:"));
    const episodesArray = episodesFind?.match(/episodes:\[(.*?)\],relations:/)?.[1]?.replace(/([{,])(\w+):/g, "$1\"$2\":") || "";

    if (episodesArray) {
      for (let i = 1; i <= JSON.parse(`[${episodesArray}]`)?.length; i++) {
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
