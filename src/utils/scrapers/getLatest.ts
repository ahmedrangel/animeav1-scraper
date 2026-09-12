import { load } from "cheerio";
import { animeav1URL, callAnimeA1 } from "../helpers";
import type { ChapterData } from "../../types";

/** * Obtiene los últimos episodios lanzados.
 * @returns {Promise<ChapterData[]>}
 * @example await getLatest()
 */
export const getLatest = async (): Promise<ChapterData[]> => {
  try {
    const chaptersData = await callAnimeA1();
    if (!chaptersData) return [];
    const $ = load(chaptersData);

    const articles = $("main > section:nth-child(1) > div > article");

    const chapters: ChapterData[] = [];
    if (articles.length > 0) {
      articles.each((i, el) => {
        chapters.push({
          title: $(el).find("header > div").text(),
          number: Number($(el).find("div > div > div > span").text()),
          cover: $(el).find("div > figure > img").attr("src") as string,
          slug: $(el).find("a").attr("href")!.replace("/media/", ""),
          url: animeav1URL + $(el).find("a").attr("href") as string
        });
      });
    }

    return chapters;
  }
  catch {
    return [];
  }
};
