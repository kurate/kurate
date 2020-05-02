package gallery.kurate.server.worker

import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf

internal const val PROCESSING_TOPIC_THUMBNAIL = "PROCESS_THUMBNAIL"
internal const val PROCESSING_TOPIC_EXIF = "PROCESS_EXIF"
private const val KEY_IMAGE_ID = "imageId"
private const val KEY_IMAGE_URI = "imageUri"
val PROCESSING_TOPICS = listOf(PROCESSING_TOPIC_THUMBNAIL, PROCESSING_TOPIC_EXIF)

data class ProcessingRequest(
  val imageId: String,
  val imageUri: String
)

fun ProcessingRequest.toJsonObject(): JsonObject {
  return jsonObjectOf(
    KEY_IMAGE_ID to imageId,
    KEY_IMAGE_URI to imageUri
  )
}

fun JsonObject.toProcessingRequest(): ProcessingRequest {
  return ProcessingRequest(
    imageId = getString(KEY_IMAGE_ID),
    imageUri = getString(KEY_IMAGE_URI)
  )
}
