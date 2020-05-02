package gallery.kurate.server.api.handler

import co.selim.gimbap.api.StreamingStore
import gallery.kurate.server.api.NotFoundException
import gallery.kurate.server.database.AlbumRepository
import gallery.kurate.server.database.PhotoRepository
import gallery.kurate.server.ext.dispose
import gallery.kurate.server.ext.endWithJson
import gallery.kurate.server.ext.notFound
import io.reactivex.Maybe
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.Handler
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonArrayOf
import io.vertx.reactivex.core.buffer.Buffer
import io.vertx.reactivex.ext.web.RoutingContext
import java.util.*

data class ImageHolder(val imageBytes: ByteArray? = null)

internal fun getImageHandler(imageStore: StreamingStore<ByteArray>) =
  Handler<RoutingContext> { context ->
    val imageId = context.pathParam("uri")
    val disposable = Single.fromCallable {
      if (imageStore.exists(imageId))
        ImageHolder(imageStore.get(imageId))
      else
        ImageHolder()
    }
      .doOnError(context::fail)
      .subscribe { imageHolder ->
        if (imageHolder.imageBytes == null) {
          context.notFound()
        } else {
          context.response()
            .putHeader("Content-Type", "image/jpeg")
            .end(Buffer.buffer(imageHolder.imageBytes))
        }
      }
    context.dispose(disposable)
  }

internal fun getPhotoByIdHandler(
  photoRepository: PhotoRepository
) =
  Handler<RoutingContext> { context ->
    val photoId = context.request().getParam("id")
    val disposable = photoRepository.getPhotoById(photoId)
      .subscribeOn(Schedulers.io())
      .switchIfEmpty(Maybe.error(NotFoundException("Photo with id $photoId not foundx")))
      .doOnError(context::fail)
      .map { photo ->
        photo.getJsonArray("photos", jsonArrayOf())
        photo
      }
      .subscribe { album -> context.endWithJson(album) }

    context.dispose(disposable)
  }
