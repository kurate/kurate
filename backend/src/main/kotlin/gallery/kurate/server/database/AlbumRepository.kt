package gallery.kurate.server.database

import io.reactivex.Maybe
import io.reactivex.Single
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.ext.mongo.MongoClient
import java.time.Instant

interface AlbumRepository {
  fun getAllAlbums(): Single<List<JsonObject>>

  fun getAlbumById(id: String): Maybe<JsonObject>

  fun createAlbum(name: String, createdAt: Instant): Maybe<JsonObject>

  fun doesAlbumExist(id: String): Single<Boolean>
}

private const val collection = "albums"

class MongoAlbumRepository(private val mongoClient: MongoClient) : AlbumRepository {
  override fun getAllAlbums(): Single<List<JsonObject>> = mongoClient
    .rxFind(collection, jsonObjectOf())

  override fun getAlbumById(id: String) = mongoClient
    .rxFindOne(collection, jsonObjectOf("_id" to id), null)

  override fun createAlbum(name: String, createdAt: Instant): Maybe<JsonObject> {
    val epochMilli = createdAt.toEpochMilli()
    return mongoClient
      .rxInsert(collection, jsonObjectOf("name" to name, "created_at" to epochMilli))
      .map { id ->
        jsonObjectOf(
          "_id" to id,
          "name" to name,
          "created_at" to epochMilli
        )
      }
  }

  override fun doesAlbumExist(id: String) = mongoClient
    .rxFindOne(collection, jsonObjectOf("_id" to id), null)
    .isEmpty
    .map(Boolean::not)
}
