package gallery.kurate.server.api

import co.selim.gimbap.api.StreamingStore
import gallery.kurate.server.api.handler.*
import gallery.kurate.server.database.AlbumRepository
import gallery.kurate.server.database.PhotoRepository
import gallery.kurate.server.ext.logger
import io.reactivex.Completable
import io.vertx.core.DeploymentOptions
import io.vertx.core.Handler
import io.vertx.core.Verticle
import io.vertx.core.http.HttpMethod
import io.vertx.reactivex.core.AbstractVerticle
import io.vertx.reactivex.ext.web.Router
import io.vertx.reactivex.ext.web.RoutingContext
import io.vertx.reactivex.ext.web.handler.BodyHandler
import io.vertx.reactivex.ext.web.handler.CorsHandler
import io.vertx.reactivex.ext.web.handler.LoggerHandler
import io.vertx.reactivex.ext.web.handler.ResponseTimeHandler
import org.koin.core.KoinComponent
import org.koin.core.inject

class ApiVerticle : AbstractVerticle(), KoinComponent {
  private val config by inject<ApiConfig>()
  private val imageStore by inject<StreamingStore<ByteArray>>()
  private val albumRepository by inject<AlbumRepository>()
  private val photoRepository by inject<PhotoRepository>()

  override fun rxStart(): Completable {
    val router = Router.router(vertx)
    router.route()
      .handler(LoggerHandler.create())
      .failureHandler(failureHandler)
      .handler(ResponseTimeHandler.create())

    val ensureAlbumExistsHandler = ensureAlbumExistsHandler(albumRepository)

    router.route("/api/*").handler(
      CorsHandler.create("((http://)|(https://))localhost\\:\\d+")
        .allowedMethods(HttpMethod.values().toSet())
        .allowedHeaders(
          setOf(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Method",
            "Access-Control-Allow-Credentials",
            "Content-Type"
          )
        )
    )

    val host = "${config.host}:${config.port}"

    router.post("/api/albums/:id")
      .handler(BodyHandler.create(true).setDeleteUploadedFilesOnEnd(true))
      .handler(ensureAlbumExistsHandler)
      .handler(uploadImagesToAlbumHandler(photoRepository, imageStore, host))
    router.get("/api/albums")
      .handler(getAllAlbumsHandler(albumRepository, host))
    router.get("/api/albums/:id")
      .handler(ensureAlbumExistsHandler)
      .handler(getAlbumByIdHandler(albumRepository, host))
    router.post("/api/albums")
      .handler(BodyHandler.create(false))
      .handler(postAlbumHandler(albumRepository))

    router.get("/api/photos/:id")
      .handler(getPhotoByIdHandler(photoRepository, host))

    router.get("/api/i/:uri")
      .handler(getImageHandler(imageStore))

    return vertx.createHttpServer()
      .requestHandler(router)
      .rxListen(config.port, config.host)
      .doOnSuccess { logger.info("Kurate running on port ${it.actualPort()}") }
      .ignoreElement()
  }

  private val failureHandler = Handler<RoutingContext> { context ->
    val cause = context.failure()
    val responseData = when (cause) {
      is NotFoundException -> 404 to ""
      else -> {
        if (context.statusCode() in 400..499)
          context.statusCode() to cause?.message.orEmpty()
        else
          500 to "Internal Server Error"
      }
    }

    responseData.let { (code, message) ->
      if (code == 500)
        logger.warn("Uncaught exception", cause)
      else
        logger.info("Handled exception (status code $code)", cause)

      context
        .response()
        .setStatusCode(code)
        .end(message)
    }
  }
}

class NotFoundException(message: String) : RuntimeException(message)

fun Verticle.deployApiVerticle() = Completable.fromRunnable {
  val deploymentOptions = DeploymentOptions()
    .setInstances(Runtime.getRuntime().availableProcessors())
  vertx.deployVerticle(ApiVerticle::class.java, deploymentOptions)
}
