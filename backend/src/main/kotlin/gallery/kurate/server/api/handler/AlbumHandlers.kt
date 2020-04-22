package gallery.kurate.server.api.handler

import co.selim.gimbap.api.StreamingStore
import gallery.kurate.server.api.NotFoundException
import gallery.kurate.server.api.buildImageUrl
import gallery.kurate.server.database.AlbumRepository
import gallery.kurate.server.database.PhotoRepository
import gallery.kurate.server.ext.dispose
import gallery.kurate.server.ext.endWithJson
import gallery.kurate.server.worker.PROCESSING_TOPICS
import gallery.kurate.server.worker.ProcessingRequest
import gallery.kurate.server.worker.toJsonObject
import io.reactivex.Maybe
import io.reactivex.Observable
import io.reactivex.schedulers.Schedulers
import io.vertx.core.Handler
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.get
import io.vertx.kotlin.core.json.jsonArrayOf
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.ext.web.RoutingContext
import java.io.File

internal fun ensureAlbumExistsHandler(albumRepository: AlbumRepository) = Handler<RoutingContext> { context ->
  val albumId = context.pathParam("id")
  val disposable = albumRepository.doesAlbumExist(albumId)
    .subscribeOn(Schedulers.io())
    .doOnError(context::fail)
    .subscribe { albumExists ->
      if (albumExists) {
        context.next()
      } else {
        context.fail(404)
      }
    }
  context.dispose(disposable)
}

internal fun uploadImagesToAlbumHandler(
  photoRepository: PhotoRepository,
  imageStore: StreamingStore<ByteArray>,
  host: String
) = Handler<RoutingContext> { context ->
  val albumId = context.pathParam("id")
  val uploads = context.fileUploads()

  val disposable = Observable
    .fromIterable(uploads)
    .subscribeOn(Schedulers.io())
    .flatMapMaybe { upload ->
      val imageFile = File(upload.uploadedFileName())
      val fileName = upload.fileName()
      val imageUri = imageFile.inputStream().use(imageStore::putStream)
      photoRepository
        .addPhoto(albumId, fileName, imageUri)
        .switchIfEmpty(Maybe.error(NotFoundException("Album with id $albumId not found")))
        .map { photo ->
          val photo = jsonObjectOf(
            "_id" to photo["_id"],
            "file_name" to fileName,
            "uri" to imageUri
          )
          populateUrls(photo, host)
          photo
        }
        .doOnSuccess { photo ->
          val processingRequest = ProcessingRequest(photo["_id"], imageUri).toJsonObject()
          PROCESSING_TOPICS.forEach { context.vertx().eventBus().send(it, processingRequest) }
        }
    }
    .collectInto(JsonArray()) { array, photo ->
      array.add(photo)
    }
    .subscribe { photos, throwable ->
      photos?.let { body -> context.endWithJson(body) }
      throwable?.let(context::fail)
    }

  context.dispose(disposable)
}

internal fun getAllAlbumsHandler(albumRepository: AlbumRepository, host: String) = Handler<RoutingContext> { context ->
  val disposable = albumRepository.getAllAlbums()
    .subscribeOn(Schedulers.io())
    .map { albumsList ->
      albumsList.map { album ->
        val photos = album.getJsonArray("photos", jsonArrayOf())
        if (!photos.isEmpty) {
          val firstPhoto = photos.first() as JsonObject
          populateUrls(firstPhoto, host)
          firstPhoto.remove("exif")
          val newPhotos = jsonArrayOf(firstPhoto)
          album.put("photos", newPhotos)
        }

        album
      }
    }
    .doOnError(context::fail)
    .subscribe { body -> context.endWithJson(body) }
  context.dispose(disposable)
}

private fun populateUrls(photo: JsonObject, host: String) {
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

internal fun getAlbumByIdHandler(
  albumRepository: AlbumRepository,
  host: String
) =
  Handler<RoutingContext> { context ->
    val albumId = context.request().getParam("id")
    val disposable = albumRepository.getAlbumById(albumId)
      .subscribeOn(Schedulers.io())
      .switchIfEmpty(Maybe.error(NotFoundException("Album with id $albumId not found")))
      .doOnError(context::fail)
      .map { album ->
        album.getJsonArray("photos")
          .also { it.forEach { photo -> populateUrls((photo as JsonObject), host) } }
      }
      .subscribe { albums -> context.endWithJson(albums) }

    context.dispose(disposable)
  }

internal fun postAlbumHandler(albumRepository: AlbumRepository) = Handler<RoutingContext> { context ->
  val jsonAlbum = context.bodyAsJson
  val disposable = albumRepository.createAlbum(jsonAlbum.getString("name"))
    .subscribeOn(Schedulers.io())
    .doOnError(context::fail)
    .subscribe { album -> context.endWithJson(album, 201) }
  context.dispose(disposable)
}
