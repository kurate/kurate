package gallery.kurate.server.database

import gallery.kurate.server.model.ThumbnailSize
import io.reactivex.Maybe
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.ext.mongo.MongoClient

interface ThumbnailRepository {
  fun addThumbnail(photoId: String, size: ThumbnailSize, dimension: Int, uri: String): Maybe<JsonObject>
}

private const val collection = "albums"

class MongoThumbnailRepository(private val mongoClient: MongoClient) : ThumbnailRepository {
  override fun addThumbnail(photoId: String, size: ThumbnailSize, dimension: Int, uri: String) = mongoClient
    .rxFindOneAndUpdate(
      collection, jsonObjectOf("photos._id" to photoId),
      jsonObjectOf(
        "\$push" to jsonObjectOf(
          "photos.\$.thumbnails" to jsonObjectOf(
            "size" to size.name,
            "dimension" to dimension,
            "uri" to uri
          )
        )
      )
    )
}
