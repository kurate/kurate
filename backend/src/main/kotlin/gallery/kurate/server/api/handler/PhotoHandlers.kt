package gallery.kurate.server.api.handler

import co.selim.gimbap.api.StreamingStore
import gallery.kurate.server.database.PhotoRepository
import gallery.kurate.server.ext.dispose
import gallery.kurate.server.ext.endWithJson
import gallery.kurate.server.ext.notFound
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.Handler
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
