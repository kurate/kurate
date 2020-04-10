package gallery.kurate.server.database

import gallery.kurate.server.model.ThumbnailSize
import io.reactivex.Maybe
import io.reactivex.Single
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.ext.mongo.MongoClient

interface ThumbnailRepository {
  fun addThumbnail(photoId: String, size: ThumbnailSize, dimension: Int, uri: String): Maybe<JsonObject>
}

private const val collection = "albums"

class MongoThumbnailRepository(private val mongoClient: MongoClient) : ThumbnailRepository {
  override fun addThumbnail(photoId: String, size: ThumbnailSize, dimension: Int, uri: String) =
    null as Maybe<JsonObject>
}
