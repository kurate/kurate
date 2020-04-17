package gallery.kurate.server.database

import co.selim.exiftool4j.ExifData
import io.reactivex.Maybe
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.ext.mongo.MongoClient

private const val collection = "albums"

interface ExifRepository {
  fun addExifData(photoId: String, exifData: ExifData): Maybe<JsonObject>
}

class MongoExifRepository(private val mongoClient: MongoClient) : ExifRepository {
  override fun addExifData(photoId: String, exifData: ExifData) = mongoClient
    .rxFindOneAndUpdate(
      collection, jsonObjectOf("photos._id" to photoId),
      jsonObjectOf(
        "\$push" to jsonObjectOf(
          "photos.\$.exif" to JsonObject(exifData.fields.mapKeys { it.key.name })
        )
      )
    )
}
