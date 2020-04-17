package gallery.kurate.server.api.handler

import co.selim.gimbap.api.StreamingStore
import gallery.kurate.server.api.NotFoundException
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
import io.vertx.reactivex.core.Vertx
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
  vertx: Vertx
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
          jsonObjectOf(
            "_id" to photo["_id"],
            "file_name" to fileName,
            "uri" to imageUri
          )
        }
        .doOnSuccess { photo ->
          val processingRequest = ProcessingRequest(photo["_id"], imageUri).toJsonObject()
          PROCESSING_TOPICS.forEach { vertx.eventBus().send(it, processingRequest) }
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

internal fun getAllAlbumsHandler(albumRepository: AlbumRepository) = Handler<RoutingContext> { context ->
  val disposable = albumRepository.getAllAlbums()
    .subscribeOn(Schedulers.io())
    .map { albumsList ->
      albumsList.map { album ->
        val photos = album.getJsonArray("photos", jsonArrayOf())
        if (!photos.isEmpty) {
          val firstPhoto = photos.first() as JsonObject
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

internal fun getAlbumByIdHandler(
  albumRepository: AlbumRepository
) =
  Handler<RoutingContext> { context ->
    val albumId = context.request().getParam("id")
    val disposable = albumRepository.getAlbumById(albumId)
      .subscribeOn(Schedulers.io())
      .switchIfEmpty(Maybe.error(NotFoundException("Album with id $albumId not found")))
      .doOnError(context::fail)
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
