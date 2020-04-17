package gallery.kurate.server.worker

import co.selim.exiftool4j.extractExifData
import co.selim.gimbap.api.StreamingStore
import gallery.kurate.server.database.ExifRepository
import gallery.kurate.server.ext.logger
import io.reactivex.Completable
import io.reactivex.Single
import io.reactivex.schedulers.Schedulers
import io.vertx.core.DeploymentOptions
import io.vertx.core.Verticle
import io.vertx.core.json.JsonObject
import io.vertx.reactivex.core.AbstractVerticle
import org.koin.core.KoinComponent
import org.koin.core.inject

class ExifExtractorVerticle : AbstractVerticle(), KoinComponent {
  private val exifRepository by inject<ExifRepository>()
  private val imageStore by inject<StreamingStore<ByteArray>>()

  override fun rxStart() = Completable.fromRunnable {
    vertx.eventBus().consumer<JsonObject>(PROCESSING_TOPIC_EXIF) { message ->
      val request = message.body().toProcessingRequest()
      val imageId = request.imageId
      val imageUri = request.imageUri

      logger.info("Extracting exif data for image $imageId")

      val exifData = imageStore.getStream(imageUri).use { it.extractExifData() }

      if (exifData.fields.isNotEmpty()) {
        // TODO: handle the disposable
        exifRepository.addExifData(imageId, exifData)
          .subscribeOn(Schedulers.io())
          .flatMapSingle { Single.just(exifData) }
          .subscribe(
            { result -> logger.info("stored exif data for $imageId: $result") },
            { throwable -> logger.error("Failed to process exif data", throwable) }
          )
      }
    }
  }.doOnComplete {
    logger.info("Deployed ${this::class.java.simpleName}")
  }
}

fun Verticle.deployExifExtractorVerticle() {
  val deploymentOptions = DeploymentOptions()
    .setInstances(Runtime.getRuntime().availableProcessors())
    .setWorker(true)
  vertx.deployVerticle(ExifExtractorVerticle::class.java, deploymentOptions)
}
