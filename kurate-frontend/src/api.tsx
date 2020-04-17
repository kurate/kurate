const BASE = "http://192.168.178.43:8338/api";

export const KURATE_API = {
  AlbumList: BASE + "/albums",
  ImgBase: BASE + "/i",
  Album: (id: string) => KURATE_API.AlbumList + "/" + id,
  Image: (uri: string) => KURATE_API.ImgBase + "/" + uri,
};
