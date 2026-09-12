import { load } from "cheerio";
import type { EpisodeInfoData, EpisodeServersData } from "../../types";
import { callAnimeA1 } from "../helpers";

/** * Obtiene los enlaces de streaming y descarga de un episodio de anime
 * @param {string} slug - El slug del anime o del episodio
 * @param {number} episode - El número del episodio (opcional si se usa el slug del episodio)
 * @returns {Promise<EpisodeInfoData | null>}
 * @example await getEpisode("one-piece", 1) // Usando slug de anime y número de episodio
 */
export const getEpisode = async (slug: string, episode: number): Promise<EpisodeInfoData | null> => {
  if (!slug || (typeof slug) !== "string") throw new Error("Slug no válido o no proporcionado");
  if (!episode || (typeof episode) !== "number") throw new Error("Número de episodio no válido o no proporcionado");
  try {
    const data = await callAnimeA1(`/media/${slug}/${episode}`).catch(() => null);
    if (!data) return null;
    const $ = load(data);

    const episodeLinks: EpisodeInfoData = {
      title: $("main > article > div > div > header > div > div > a").text(),
      number: episode,
      embeds: [] as EpisodeServersData[],
      downloads: [] as EpisodeServersData[]
    };

    const scripts = $("script");
    const embedsStr = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("embeds:"))?.match(/embeds:{SUB:\[(.*?)\]}/)?.[1]?.replace(/([{,])(\w+):/g, "$1\"$2\":") || "";
    const downloadsStr = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("downloads:"))?.match(/downloads:{SUB:\[(.*?)\]}/)?.[1]?.replace(/([{,])(\w+):/g, "$1\"$2\":") || "";
    if (embedsStr) {
      const servers = JSON.parse(`[${embedsStr}]`);
      for (const s of servers) {
        episodeLinks.embeds.push({
          name: s?.server,
          url: s?.url
        });
      }
    }
    if (downloadsStr) {
      const servers = JSON.parse(`[${downloadsStr}]`);
      for (const s of servers) {
        episodeLinks.downloads.push({
          name: s?.server,
          url: s?.url
        });
      }
    }
    return episodeLinks;
  }
  catch {
    return null;
  }
};
