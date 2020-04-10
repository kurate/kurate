package gallery.kurate.server.ext

import io.vertx.core.logging.Logger
import io.vertx.core.logging.LoggerFactory

val <T : Any> T.logger: Logger
  get() = LoggerFactory.getLogger(this::class.java)
