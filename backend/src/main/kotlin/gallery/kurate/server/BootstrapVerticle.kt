package gallery.kurate.server

import co.selim.gimbap.BinaryStore
import co.selim.gimbap.api.StreamingStore
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import gallery.kurate.server.api.ApiConfig
import gallery.kurate.server.api.deployApiVerticle
import gallery.kurate.server.database.*
import gallery.kurate.server.worker.deployExifExtractorVerticle
import gallery.kurate.server.worker.deployThumbnailCreatorVerticle
import io.reactivex.plugins.RxJavaPlugins
import io.vertx.core.json.JsonObject
import io.vertx.core.json.jackson.DatabindCodec
import io.vertx.kotlin.core.json.get
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.reactivex.config.ConfigRetriever
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.core.RxHelper
import io.vertx.reactivex.core.Vertx
import io.vertx.reactivex.ext.mongo.MongoClient
import org.koin.core.context.startKoin
import org.koin.core.module.Module
import org.koin.dsl.module
import java.nio.file.Paths

class BootstrapVerticle : AbstractVerticle() {
  init {
    DatabindCodec.mapper().apply { registerKotlinModule() }
    RxJavaPlugins.setComputationSchedulerHandler { RxHelper.scheduler(vertx) }
    RxJavaPlugins.setIoSchedulerHandler { RxHelper.blockingScheduler(vertx) }
    RxJavaPlugins.setNewThreadSchedulerHandler { RxHelper.scheduler(vertx) }
  }

  override fun rxStart() = ConfigRetriever
    .create(vertx)
    .rxGetConfig()
    .flatMapCompletable { config ->
      val configModule = module {
        single<ApiConfig> { config.getJsonObject("http").mapTo(ApiConfig::class.java) }
      }

      val persistenceModule = getPersistenceModule(config["db"])

      startKoin { modules(listOf(configModule, persistenceModule)) }

      deployApiVerticle()
        .andThen(deployThumbnailCreatorVerticle())
        .andThen(deployExifExtractorVerticle())
    }

  private fun getPersistenceModule(config: JsonObject): Module {
    val mongoClient = MongoClient.createShared(
      vertx,
      jsonObjectOf(
        "db_name" to config.getString("name"),
        "connection_string" to config.getString("url")
      )
    )

    return module {
      single<PhotoRepository> {
        MongoPhotoRepository(
          mongoClient
        )
      }

      single<AlbumRepository> {
        MongoAlbumRepository(
          mongoClient
        )
      }

      single<ThumbnailRepository> {
        MongoThumbnailRepository(
          mongoClient
        )
      }

      single<ExifRepository> {
        MongoExifRepository(
          mongoClient
        )
      }

      single<StreamingStore<ByteArray>> {
        BinaryStore(Paths.get("images"))
      }
    }
  }
}

fun main() {
  Vertx.vertx().deployVerticle(BootstrapVerticle())
}
