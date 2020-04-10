package gallery.kurate.server.model

enum class ThumbnailSize(
  val dimension: Int
) {
  TINY(64),
  SMALL(256),
  MEDIUM(512),
  LARGE(1024)
}
