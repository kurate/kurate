package gallery.kurate.server.worker

import co.selim.gimbap.api.StreamingStore
import co.selim.thumbnail4j.createThumbnail
import gallery.kurate.server.database.ThumbnailRepository
import gallery.kurate.server.ext.logger
import gallery.kurate.server.model.ThumbnailSize
import io.reactivex.Completable
import io.reactivex.schedulers.Schedulers
import io.vertx.core.DeploymentOptions
import io.vertx.core.Verticle
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import org.koin.core.KoinComponent
import org.koin.core.inject

const val THUMBNAIL_TOPIC = "thumbnailPlease"
const val KEY_IMAGE_ID = "imageId"
const val KEY_IMAGE_URI = "imageUri"

class ThumbnailCreatorVerticle : AbstractVerticle(), KoinComponent {
  private val thumbnailRepository by inject<ThumbnailRepository>()
  private val imageStore by inject<StreamingStore<ByteArray>>()

  override fun rxStart() = Completable.fromRunnable {
    vertx.eventBus().consumer<JsonObject>(THUMBNAIL_TOPIC) { message ->
      val thumbnailRequest = message.body()
      val imageId = thumbnailRequest.getString(KEY_IMAGE_ID)
      val imageUri = thumbnailRequest.getString(KEY_IMAGE_URI)

      logger.info("Creating thumbnail for image $imageId")

      ThumbnailSize
        .values()
        .forEach { size ->
          val imageInputStream = imageStore.getStream(imageUri)
          val bytes = imageInputStream.use { it.createThumbnail(size.dimension) }
          val thumbnailUri = imageStore.put(bytes)
          thumbnailRepository.addThumbnail(imageId, size, size.dimension, thumbnailUri)
            .subscribeOn(Schedulers.io())
            .subscribe()
        }
    }
  }
}

fun Verticle.deployThumbnailCreatorVerticle() {
  val deploymentOptions = DeploymentOptions()
    .setInstances(Runtime.getRuntime().availableProcessors())
    .setWorker(true)
  vertx.deployVerticle(ThumbnailCreatorVerticle::class.java, deploymentOptions)
}
