package gallery.kurate.server.worker

import co.selim.gimbap.api.StreamingStore
import co.selim.thumbnail4j.createThumbnail
import gallery.kurate.server.database.ThumbnailRepository
import gallery.kurate.server.ext.logger
import gallery.kurate.server.model.ThumbnailSize
import io.reactivex.Completable
import io.reactivex.Observable
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.DeploymentOptions
import io.vertx.core.Verticle
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import org.koin.core.KoinComponent
import org.koin.core.inject

class ThumbnailCreatorVerticle : AbstractVerticle(), KoinComponent {
  private val thumbnailRepository by inject<ThumbnailRepository>()
  private val imageStore by inject<StreamingStore<ByteArray>>()

  override fun rxStart() = Completable.fromRunnable {
    vertx.eventBus().consumer<JsonObject>(PROCESSING_TOPIC_THUMBNAIL) { message ->
      val request = message.body().toProcessingRequest()
      val imageId = request.imageId
      val imageUri = request.imageUri

      logger.info("Creating thumbnail for image $imageId")

      // TODO: handle the disposable
      Observable.fromIterable(ThumbnailSize.values().asIterable())
        .flatMapSingle { size ->
          val imageInputStream = imageStore.getStream(imageUri)
          val bytes = imageInputStream.use { it.createThumbnail(size.dimension) }
          val thumbnailUri = imageStore.put(bytes)
          thumbnailRepository.addThumbnail(imageId, size, size.dimension, thumbnailUri)
            .flatMapSingle { Single.just(size) }
        }
        .subscribeOn(Schedulers.io())
        .subscribe(
          { size -> logger.info("created $size thumbnail for $imageId") },
          { throwable -> logger.error("Failed to create thumbnail", throwable) }
        )
    }
  }.doOnComplete {
    logger.info("Deployed ${this::class.java.simpleName}")
  }
}

fun Verticle.deployThumbnailCreatorVerticle() = Completable.fromRunnable {
  val deploymentOptions = DeploymentOptions()
    .setInstances(Runtime.getRuntime().availableProcessors())
    .setWorker(true)
  vertx.deployVerticle(ThumbnailCreatorVerticle::class.java, deploymentOptions)
}
