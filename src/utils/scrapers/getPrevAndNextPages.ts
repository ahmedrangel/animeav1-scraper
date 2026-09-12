import type { CheerioAPI } from "cheerio";
import { animeav1URL } from "../helpers";

export const getNextAndPrevPages = ($: CheerioAPI): {
  foundPages: number;
  previousPage: string | null;
  nextPage: string | null;
} => {

  const scripts = $("script");
  const selector = $("main > section").children("div").eq(3);
  const paginationFind = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("pagination:"));
  const episodesObj = paginationFind?.match(/pagination:(\{[^}]+\})/)?.[1]?.replace(/([{,])(\w+):/g, "$1\"$2\":") || "";
  const pagination = episodesObj ? JSON.parse(episodesObj) : {};
  let previousPage, nextPage;
  if ($(selector).find("span").first().text() === "1" || pagination.totalPages === 1 || !pagination.totalPages) {
    previousPage = null;
  }
  else {
    previousPage = animeav1URL + $(selector).find("span").first().prev("a").attr("href");
  }

  if ($(selector).find("span").last().text() === pagination.totalPages.toString() || pagination.totalPages === 1 || !pagination.totalPages) {
    nextPage = null;
  }
  else {
    nextPage = animeav1URL + $(selector).find("span").next("a").attr("href");
  }
  return { foundPages: pagination.totalPages || 1, nextPage, previousPage };
};
