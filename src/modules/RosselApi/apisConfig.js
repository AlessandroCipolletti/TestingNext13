import { API_HOST, GET, PUT, DELETE, PATCH } from "./constants"
import { DEFAULT_CACHE_DURATION } from "@/modules/Cache/cacheConfig"


// **********************************************
// **************** ATTENTION *******************
// ******** CACHE IS ENABLED BY DEFAULT *********
// To disable cache just pass 0 to cacheDuration
// **********************************************

export const api = (
  apiUrl,
  method = GET,
  cacheDuration = DEFAULT_CACHE_DURATION,
  isPublic = true,
) => ({
  url: `${API_HOST}api/${apiUrl}`,
  method,
  cacheDuration,
  isPublic,
})


const apisConfig = {
  // articles apis examples
  getArticles: api("/articles"),
  getOneArticle: api("/articles/${id}"),
  saveArticle: api("/articles", PUT, 0, false),
  updateArticle: api("/articles/${id}", PATCH, 0, false),
  deleteArticle: api("/articles/${id}", DELETE, 0, false),

  // other apis
  // [...]
}


export default apisConfig
