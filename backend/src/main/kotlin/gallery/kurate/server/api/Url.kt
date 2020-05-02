package gallery.kurate.server.api

fun buildImageUrl(host: String, uri: String): String = "$host/api/i/$uri"
