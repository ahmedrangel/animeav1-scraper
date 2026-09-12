import { load } from "cheerio";
import type { EpisodeInfoData, EpisodeServersData } from "../../types";
import { callAnimeA1, getSvelteData } from "../helpers";

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

    const { embeds, downloads } = getSvelteData($)!;

    const episodeLinks: EpisodeInfoData = {
      title: $("main > article > div > div > header > div > h1").first().text(),
      number: episode,
      embeds: [] as EpisodeServersData[],
      downloads: [] as EpisodeServersData[]
    };

    if (embeds) {
      // Unificar DUB y SUB en un solo array, e identificar si es un dub o sub
      const servers = [...(embeds.SUB || []).map(s => ({ ...s, type: "SUB" as const })), ...(embeds.DUB || []).map(s => ({ ...s, type: "DUB" as const }))];
      for (const s of servers) {
        episodeLinks.embeds.push({
          name: s?.server,
          url: s?.url,
          type: s?.type
        });
      }
    }
    if (downloads) {
      const servers = [...(downloads.SUB || []).map(s => ({ ...s, type: "SUB" as const })), ...(downloads.DUB || []).map(s => ({ ...s, type: "DUB" as const }))];
      for (const s of servers) {
        episodeLinks.downloads.push({
          name: s?.server,
          url: s?.url,
          type: s?.type
        });
      }
    }
    return episodeLinks;
  }
  catch {
    return null;
  }
};
