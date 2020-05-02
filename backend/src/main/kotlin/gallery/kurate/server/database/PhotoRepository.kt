package gallery.kurate.server.database

import io.reactivex.Maybe
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.ext.mongo.MongoClient
import org.bson.types.ObjectId

interface PhotoRepository {
  fun addPhoto(albumId: String, fileName: String, uri: String): Maybe<JsonObject>
  fun getPhotoById(id: String): Maybe<JsonObject>
}

private const val collection = "albums"

class MongoPhotoRepository(private val mongoClient: MongoClient) : PhotoRepository {
  override fun addPhoto(albumId: String, fileName: String, uri: String): Maybe<JsonObject> {
    val photoId = ObjectId.get().toHexString()
    return doAddPhoto(albumId, photoId, fileName, uri)
      .map { jsonObjectOf("_id" to photoId) }
  }

  override fun getPhotoById(id: String): Maybe<JsonObject> = mongoClient
    .rxFindOne(collection, jsonObjectOf("photos._id" to id), null)

  private fun doAddPhoto(
    albumId: String,
    photoId: String,
    fileName: String,
    uri: String
  ) = mongoClient.rxFindOneAndUpdate(
    collection, jsonObjectOf("_id" to albumId),
    jsonObjectOf(
      "\$push" to jsonObjectOf(
        "photos" to jsonObjectOf(
          "_id" to photoId,
          "file_name" to fileName,
          "uri" to uri
        )
      )
    )
  )
}
