const BASE = "http://localhost:8338/api";

export const KURATE_API = {
  AlbumList: BASE + "/albums",
  Album: (id: string) => KURATE_API.AlbumList + "/" + id,
};
