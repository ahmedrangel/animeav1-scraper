import type { CheerioAPI } from "cheerio";
import { animeav1URL } from "../helpers";
import type { AnimeType, PartialAnimeData } from "../../types";

export const scrapSearchAnimeData = ($: CheerioAPI): PartialAnimeData[] => {
  const selector = $("main > section > div > article");
  if (selector.length > 0) {
    const media: PartialAnimeData[] = [];

    selector.each((i, el) => {
      const type = $(el).find("div:nth-child(1) > div > div").text() as AnimeType;
      media.push({
        title: $(el).find("header > h3").text(),
        cover: $(el).find("figure > img").attr("src")!,
        synopsis: $(el).find("div > div > div > p").text(),
        slug: $(el).find("a").attr("href")!.replace("/media/", ""),
        type: type,
        url: animeav1URL + ($(el).find("a").attr("href") as string)
      });
    });

    return media;
  }
  else {
    return [];
  }
};
