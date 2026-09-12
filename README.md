# animeav1-scraper

Librería tipada para extraer información del sitio `https://animeav1.com/`.

## Instalación
```sh
# npm
npm i animeav1-scraper

# yarn
yarn add animeav1-scraper

# pnpm
pnpm add animeav1-scraper
```

## Licencia
[MIT License](https://github.com/ahmedrangel/animeav1-scraper/blob/main/LICENSE)

# Funciones
### getAnimeInfo(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`slug`|string|✅|El slug del anime|

```js
import { getAnimeInfo } from "animeav1-scraper";

const result = await getAnimeInfo("one-piece");
```

### getEpisode(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`slug`|string|✅|El slug del anime o del episodio|
|`episode`|number|✅|El número de episodio|

```js
import { getEpisode } from "animeav1-scraper";

// Usando slug de anime y número de episodio
const result = await getEpisode("one-piece", 1)
```

### searchAnime(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`query`|string|✅|La consulta de búsqueda|
|`page`|number|❌|El número de página para la búsqueda

```js
import { searchAnime } from "animeav1-scraper";

const result = await searchAnime("romance");
```
```js
// Consultando la página número 2
const result = await searchAnime("romance", 2);
```

### searchAnimesByFilter(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`options`|FilterOptions|❌|Opciones de filtro para la búsqueda|
|`options.genres`|AnimeGenre[]|❌|Géneros de anime|
|`options.categories`|AnimeType[]|❌|Categorías de anime|
|`options.statuses`|AnimeStatus[]|❌|Estados de anime|
|`options.order`|FilterOrderType|❌|El orden (por defecto "Predeterminado")|
|`options.page`|number|❌|El número de página (por defecto 1)|
|`options.minYear`|number|❌|Año mínimo de lanzamiento|
|`options.maxYear`|number|❌|Año máximo de lanzamiento|


```js
import { searchAnimesByFilter } from "animeav1-scraper";

const result = await searchAnimesByFilter({
  genres: ["Acción", "Aventura", "Ciencia Ficción", "Comedia"],
  statuses: ["En emisión", "Finalizado", "Próximamente"],
  categories: ["OVA", "ONA", "TV Anime", "Película", "Especial"],
  order: "Populares",
  page: 1,
  minYear: 2024,
  maxYear: 2026
});
```

### searchAnimesByURL(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`url`|string|✅|La URL específica para buscar animes|

```js
import { searchAnimesByURL } from "animeav1-scraper";

const result = await searchAnimesByURL("https://animeav1.com/catalogo?search=one+piece");
```

### getLatest()
```js
import { getLatest } from "animeav1-scraper";

const result = await getLatest();
```
