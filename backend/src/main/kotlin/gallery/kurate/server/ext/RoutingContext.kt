package gallery.kurate.server.ext

import io.reactivex.disposables.Disposable
import io.vertx.core.json.Json
import io.vertx.reactivex.ext.web.RoutingContext

fun RoutingContext.dispose(disposable: Disposable) = addBodyEndHandler { disposable.dispose() }

fun RoutingContext.endWithJson(body: Any, statusCode: Int = 200) = response()
  .setStatusCode(statusCode)
  .putHeader("Content-Type", "application/json; charset=utf-8")
  .end(Json.encode(body))

fun RoutingContext.notFound() = response()
  .setStatusCode(404)
  .end()
