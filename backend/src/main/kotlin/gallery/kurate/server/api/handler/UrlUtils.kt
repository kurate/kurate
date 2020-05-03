package gallery.kurate.server.api.handler

import gallery.kurate.server.api.buildImageUrl
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonArrayOf

internal fun populateUrls(photo: JsonObject, host: String) {
  photo.put("url", buildImageUrl(host, photo.getString("uri")))
  photo.remove("uri")
  val thumbnails = photo.getJsonArray("thumbnails", jsonArrayOf())
  for (thumbnail in thumbnails) {
    if (thumbnail is JsonObject) {
      thumbnail.put("url", buildImageUrl(host, thumbnail.getString("uri")))
      thumbnail.remove("uri")
    }
  }
}
