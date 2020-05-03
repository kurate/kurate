export const KURATE_URLS = {
  Home: "/albums",
  Album: (id: string) => KURATE_URLS.Home + "/" + id,
  Image_Base: "/image",
  Image: (uri: string) => KURATE_URLS.Image_Base + "/" + uri,
};
