package gallery.kurate.server.database

import io.reactivex.Maybe
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.ext.mongo.MongoClient
import org.bson.types.ObjectId

interface PhotoRepository {
  fun addPhoto(albumId: String, fileName: String, uri: String): Maybe<JsonObject>
}

private const val collection = "albums"

class MongoPhotoRepository(private val mongoClient: MongoClient) : PhotoRepository {
  override fun addPhoto(albumId: String, fileName: String, uri: String) = mongoClient
    .rxFindOneAndUpdate(
      collection, jsonObjectOf("_id" to albumId),
      jsonObjectOf(
        "\$push" to jsonObjectOf(
          "photos" to jsonObjectOf(
            "_id" to ObjectId.get().toHexString(),
            "fileName" to fileName,
            "uri" to uri
          )
        )
      )
    )
}
